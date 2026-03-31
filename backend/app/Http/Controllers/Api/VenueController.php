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
        $aiFilters = null;

        if ($request->filled('query')) {
            $responseAi = $this->parseSearch($request);
            if ($responseAi->status() === 200 && !isset($responseAi->getData()->error)) {
                $aiData = $responseAi->getData();
                $aiFilters = $aiData;
                if (!empty($aiFilters->address)) {
                    $query->where('address', 'like', '%' . $aiFilters->address . '%');
                }
                if (!empty($aiFilters->sport)) {
                    $query->where('name', 'like', '%' . $aiFilters->sport . '%');
                }
                if (!empty($aiFilters->date)) {
                    $date = $aiFilters->date;
                    $query->whereHas('timeSlots', function ($q) use ($date) {
                        $q->whereDoesntHave('bookings', fn($bq) => $bq->where('booking_date', $date));
                    });
                }
            }
        } else {
            // Lọc truyền thống
            if ($request->filled('address') && $request->input('address') !== 'all') {
                $query->where('address', 'like', '%' . $request->input('address') . '%');
            }

            if ($request->filled('sport') && $request->input('sport') !== 'all') {
                $sportName = $request->input('sport');
                $query->whereHas('sport', function ($q) use ($sportName) {
                    $q->where('name', 'like', '%' . $sportName . '%');
                });
            }

            if ($request->filled('date')) {
                $date = $request->input('date');
                $query->whereHas('timeSlots', function ($q) use ($date) {
                    $q->whereDoesntHave('bookings', fn($bq) => $bq->where('booking_date', $date));
                });
            }
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->get(),
            'ai_filters' => $aiFilters
        ]);
    }

    /**
     * POST /api/venues
     */
    public function store(Request $request)
    {
        $request->validate([
            'sport_id' => 'nullable|integer|min:1',
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
            'sport_id' => $request->sport_id,
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
     * GET /api/venues/{id}/bookings
     */
    public function showBooking($id)
    {
        $bookings = Venue::findOrFail($id)->bookings()->with(['timeSlot', 'user', 'venue'])->get();

        return response()->json([
            'success' => true,
            'data' => $bookings
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

    public function parseSearch(Request $request)
    {
        $request->validate(['query' => 'required|string']);
        $userQuery = $request->input('query');
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            Log::error('GEMINI_API_KEY is not set in the .env file.');
            return response()->json(['error' => 'AI service is not configured. Please set GEMINI_API_KEY in your .env file.'], 500);
        }

        // Sửa lại model đúng: gemini-1.5-flash
        $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        $apiUrl = $baseUrl . '?key=' . urlencode($apiKey);

        $prompt = "
            You are an intelligent assistant for a sports booking application.
            Your task is to parse a user's search query and extract structured information.
            The user query is in Vietnamese.
            Today's date is: " . now()->format('Y-m-d') . ". If the user says 'ngày mai' (tomorrow), use the date for tomorrow.

            Extract the following information if available:
            - 'date': The date the user wants to book. If they say 'hôm nay' (today), use today's date. If they say 'ngày mai' (tomorrow), use tomorrow's date. Format it as 'YYYY-MM-DD'.
            - 'sport': The type of sport (e.g., 'cầu lông', 'bóng đá').
            - 'address': The location or district (e.g., 'phú nhuận', 'quận 7').

            Return a valid JSON object.

            User query: \"{$userQuery}\"
        ";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json'
            ]
        ];

        try {
            $response = Http::post($apiUrl, $payload);

            if (!$response->successful()) {
                $errorDetails = $response->json();

                // Nếu lỗi 404 (Model not found), thử lấy danh sách model khả dụng để debug
                if ($response->status() === 404) {
                    try {
                        $listResponse = Http::get("https://generativelanguage.googleapis.com/v1beta/models?key=" . urlencode($apiKey));
                        if ($listResponse->successful()) {
                            $availableModels = collect($listResponse->json('models', []))
                                ->filter(fn($m) => in_array('generateContent', $m['supportedGenerationMethods'] ?? []))
                                ->pluck('name')
                                ->values();
                            $errorDetails['available_models'] = $availableModels;
                            $errorDetails['hint'] = 'Model gemini-1.5-flash không tìm thấy. Hãy sử dụng một trong các model trong available_models.';
                        }
                    } catch (\Exception $e) { /* ignore */ }
                }

                Log::error('Gemini API request failed', [
                    'status' => $response->status(),
                    'response' => $errorDetails
                ]);
                return response()->json([
                    'error' => 'Error communicating with AI service.',
                    'details' => $errorDetails
                ], $response->status());
            }

            // The structure is usually candidates[0].content.parts[0].text
            $responseData = $response->json();
            $responseText = data_get($responseData, 'candidates.0.content.parts.0.text');

            if (!$responseText) {
                Log::warning('Gemini API response did not contain expected text.', ['response' => $responseData]);
                return response()->json(['error' => 'AI service returned an empty or invalid response.'], 500);
            }

            // Try to parse JSON directly
            $parsedData = json_decode($responseText, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                // Fallback: clean up markdown if present
                $jsonString = trim(str_replace(['```json', '```', "\n"], '', $responseText));
                $parsedData = json_decode($jsonString, true);
            }

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('JSON decode failed', ['error' => json_last_error_msg(), 'raw' => $responseText]);
                return response()->json(['error' => 'Failed to parse AI response as JSON.', 'raw_response' => $responseText], 500);
            }

            // Optionally ensure it has the expected keys or add defaults
            return response()->json($parsedData);

        } catch (\Exception $e) {
            Log::error('Exception when calling Gemini API', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}
