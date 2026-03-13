<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VenueController extends Controller
{
    /**
     * GET /api/venues
     */
    public function index(Request $request)
    {
        $query = Venue::query();

        if ($request->has('address')) {
            $query->where('address', 'like', '%' . $request->input('address') . '%');
        }

        if ($request->has('sport')) {
            $query->where('name', 'like', '%' . $request->input('sport') . '%');
        }

        if ($request->has('date')) {
            $request->validate(['date' => 'date_format:Y-m-d']);
            $date = $request->input('date');

            $query->whereHas('timeSlots', function ($timeSlotQuery) use ($date) {
                $timeSlotQuery->whereDoesntHave('bookings', function ($bookingQuery) use ($date) {
                    $bookingQuery->where('booking_date', $date);
                });
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->with('timeSlots')->latest()->get()
        ]);
    }

    /**
     * POST /api/venues
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'price_per_hour' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('venues', 'public');
        }

        $venue = Venue::create([
            'name' => $request->name,
            'address' => $request->address,
            'price_per_hour' => $request->price_per_hour,
            'image' => $imagePath,
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'data' => $venue
        ], 201);
    }

    /**
     * GET /api/venues/{id}
     */
    public function show($id)
    {
        $venue = Venue::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $venue
        ]);
    }

    /**
     * PUT /api/venues/{id}
     */
    public function update(Request $request, $id)
    {
        $venue = Venue::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'price_per_hour' => 'sometimes|numeric',
            'image' => 'nullable|image|max:2048',
            'status' => 'sometimes|in:active,inactive',
        ]);

        if ($request->hasFile('image')) {
            if ($venue->image) {
                Storage::disk('public')->delete($venue->image);
            }
            $venue->image = $request->file('image')->store('venues', 'public');
        }

        $venue->update($request->except('image'));

        return response()->json([
            'success' => true,
            'data' => $venue
        ]);
    }

    /**
     * DELETE /api/venues/{id}
     */
    public function destroy($id)
    {
        $venue = Venue::findOrFail($id);

        if ($venue->image) {
            Storage::disk('public')->delete($venue->image);
        }

        $venue->delete();

        return response()->json([
            'success' => true,
            'message' => 'Venue deleted successfully'
        ]);
    }

    /**
     * POST /api/venues/parse-search
     * Phân tích câu tìm kiếm của người dùng bằng Gemini
     */
    public function parseSearch(Request $request)
    {
        $request->validate(['query' => 'required|string']);
        $userQuery = $request->input('query');
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            Log::error('GEMINI_API_KEY is not set in the .env file.');
            return response()->json(['error' => 'AI service is not configured. Please set GEMINI_API_KEY in your .env file.'], 500);
        }

        $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$apiKey}";

        $prompt = "
            You are an intelligent assistant for a sports booking application.
            Your task is to parse a user's search query and extract structured information.
            The user query is in Vietnamese.
            Today's date is: " . now()->format('Y-m-d') . ". If the user says 'ngày mai' (tomorrow), use the date for tomorrow.

            Extract the following information if available:
            - 'date': The date the user wants to book. If they say 'hôm nay' (today), use today's date. If they say 'ngày mai' (tomorrow), use tomorrow's date. Format it as 'YYYY-MM-DD'.
            - 'sport': The type of sport (e.g., 'cầu lông', 'bóng đá').
            - 'address': The location or district (e.g., 'phú nhuận', 'quận 7').

            Return ONLY a valid JSON object as the result. Do not include any other text, explanations, or markdown formatting like ```json.

            User query: \"{$userQuery}\"
        ";

        $payload = [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ];

        try {
            $response = Http::post($apiUrl, $payload);

            if (!$response->successful()) {
                Log::error('Gemini API request failed', ['response' => $response->json()]);
                return response()->json(['error' => 'Error communicating with AI service.', 'details' => $response->json()], $response->status());
            }

            $responseText = $response->json('candidates.0.content.parts.0.text');

            if (!$responseText) {
                Log::warning('Gemini API response did not contain expected text.', ['response' => $response->json()]);
                return response()->json(['error' => 'AI service returned an empty or invalid response.'], 500);
            }

            $jsonString = trim(str_replace(['```json', '```'], '', $responseText));
            $parsedData = json_decode($jsonString, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json(['error' => 'Failed to parse AI response as JSON.', 'raw_response' => $result->text()], 500);
            }

            return response()->json($parsedData);
        } catch (\Exception $e) {
            Log::error('Exception when calling Gemini API', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}
