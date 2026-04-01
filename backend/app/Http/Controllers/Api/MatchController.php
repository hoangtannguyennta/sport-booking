<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matches;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
class MatchController extends Controller
{
    // 📌 Danh sách matches
    public function index(Request $request)
    {
        $queryBuilder = Matches::with([
            'booking',
            'booking.venue',
            'booking.timeSlot',
            'host',
            'usersMatch'
        ]);

        if ($request->filled('query')) {
            $responseAi = $this->parseSearch($request);
            $aiData = $responseAi->getData();

            // Fallback: Nếu AI lỗi hoặc hết request, sử dụng hàm manualParse để tự xử lý
            if ($responseAi->status() !== 200 || isset($aiData->error)) {
                $aiData = $this->manualParse($request->input('query'));
            }

            $queryBuilder->when(!empty($aiData->sport), function ($q) use ($aiData) {
                $q->whereHas('booking.venue', function ($venueQ) use ($aiData) {
                    $venueQ->whereHas('sport', function ($sportQ) use ($aiData) {
                        $sportQ->where('name', 'like', '%' . $aiData->sport . '%');
                    });
                });
            })
            ->when(!empty($aiData->address), function ($q) use ($aiData) {
                $q->whereHas('booking.venue', function ($venueQ) use ($aiData) {
                    $venueQ->where('address', 'like', '%' . $aiData->address . '%');
                });
            })
            ->when(!empty($aiData->date), function ($q) use ($aiData) {
                $q->whereHas('booking', function ($bookingQ) use ($aiData) {
                    $dates = is_array($aiData->date) ? $aiData->date : [$aiData->date];
                    $bookingQ->whereIn('booking_date', $dates);
                });
            })
            ->when(!empty($aiData->price_max), function ($q) use ($aiData) {
                $q->whereHas('booking.venue', function ($venueQ) use ($aiData) {
                    $venueQ->where('price_per_hour', '<=', $aiData->price_max);
                });
            })
            ->when(!empty($aiData->time_from), function ($q) use ($aiData) {
                $q->whereHas('booking.timeSlot', function ($slotQ) use ($aiData) {
                    $slotQ->where('start_time', '>=', $aiData->time_from);
                });
            })
            ->when(!empty($aiData->time_to), function ($q) use ($aiData) {
                $q->whereHas('booking.timeSlot', function ($slotQ) use ($aiData) {
                    $slotQ->where('end_time', '<=', $aiData->time_to);
                });
            })
            ->when(!empty($aiData->skill_level), function ($q) use ($aiData) {
                $q->where('skill_level', $aiData->skill_level);
            });
            
            $aiFilters = $aiData; 
        }

        $matches = $queryBuilder
        ->whereHas('booking', function ($bookingQ) {
            $bookingQ->where('booking_date', '>=', now()->format('Y-m-d'));
        })
        ->latest()->get();

        return response()->json([
            'matches' => $matches,
            'ai_filters' => $aiFilters ?? null
        ]);
    }

    // 📌 Tạo match từ booking
    public function store(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'max_players' => 'required|integer|min:2',
            'skill_level' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($request->booking_id);

        $match = Matches::create([
            'booking_id'   => $booking->id,
            'host_user_id' => $booking->user_id,
            'status'       => 'open',
            'max_players'  => $request->max_players,
            'skill_level'  => $request->skill_level,
        ]);

        // Host auto join match
        $match->usersMatch()->attach($booking->user_id, ['role' => 'host']);

        return response()->json([
            'message' => 'Match created successfully',
            'match'   => $match
        ], 201);
    }

    // 📌 Join match
    public function join($id)
    {
        $match = Matches::findOrFail($id);

        if ($match->usersMatch()->count() >= $match->max_players) {
            return response()->json([
                'message' => 'Match is full'
            ], 400);
        }
        
        $match->usersMatch()->syncWithoutDetaching(auth()->id());

        return response()->json([
            'message' => 'Joined match successfully',
            'auth_id' => auth()->id()
        ]);
    }

    // 📌 Rời match
    public function leave($id)
    {
        $match = Matches::findOrFail($id);
        $match->usersMatch()->detach(auth()->id());

        return response()->json([
            'message' => 'Left match'
        ]);
    }

    // 📌 Chi tiết match
    public function show($id)
    {
        $match = Matches::with([
            'booking.venue',
            'booking.timeSlot',
            'usersMatch',
            'host'
        ])->findOrFail($id);

        return response()->json([
            'match' => $match
        ]);
    }

    /**
     * Xử lý tìm kiếm bằng từ khóa tiếng Việt (Fallback khi AI lỗi)
     */
    private function manualParse($query)
    {
        $query = mb_strtolower($query);
        $data = [
            'sport' => null,
            'address' => null,
            'date' => null,
            'price_max' => null,
            'time_from' => null,
            'time_to' => null,
            'skill_level' => null,
        ];

        // Danh sách các địa danh/con đường để nhận diện thủ công (Tập trung vào Huế)
        $locations = [
            'nguyễn trãi' => 'Nguyễn Trãi',
            'lê lợi' => 'Lê Lợi',
            'hùng vương' => 'Hùng Vương',
            'điện biên phủ' => 'Điện Biên Phủ',
            'gia hội' => 'Gia Hội',
            'tây lộc' => 'Tây Lộc',
            'vỹ dạ' => 'Vỹ Dạ',
            'huế' => 'Huế',
            'đà nẵng' => 'Đà Nẵng',
            'hà nội' => 'Hà Nội',
            'hồ chí minh' => 'Hồ Chí Minh',
        ];

        foreach ($locations as $keyword => $formattedName) {
            if (str_contains($query, $keyword)) {
                $data['address'] = $formattedName;
                break;
            }
        }

        // Lọc theo giá
        if (str_contains($query, 'rẻ')) $data['price_max'] = 100000;
        if (str_contains($query, 'tầm trung')) $data['price_max'] = 200000;
        if (preg_match('/dưới (\d+)k/', $query, $matches)) $data['price_max'] = $matches[1] * 1000;

        // Lọc theo khung giờ (buổi)
        if (str_contains($query, 'sáng')) { $data['time_from'] = '06:00'; $data['time_to'] = '12:00'; }
        if (str_contains($query, 'chiều')) { $data['time_from'] = '13:00'; $data['time_to'] = '18:00'; }
        if (str_contains($query, 'tối')) { $data['time_from'] = '18:00'; $data['time_to'] = '22:00'; }

        // Lọc theo trình độ
        if (str_contains($query, 'yếu')) $data['skill_level'] = 'newbie';
        if (str_contains($query, 'mới chơi') || str_contains($query, 'biết chơi')) $data['skill_level'] = 'beginner';
        if (str_contains($query, 'trung bình') || str_contains($query, 'khá')) $data['skill_level'] = 'intermediate';
        if (str_contains($query, 'trình cao') || str_contains($query, 'nâng cao') || str_contains($query, 'mạnh') || str_contains($query, 'giỏi')) $data['skill_level'] = 'advanced';

        // Lọc theo thời gian (ngày)
        $foundDates = [];
        if (str_contains($query, 'nay')) {
            $foundDates[] = now()->format('Y-m-d');
        }
        if (str_contains($query, 'mai')) {
            $foundDates[] = now()->addDay()->format('Y-m-d');
        }

        $dayMap = [
            'thứ 2' => 1, 'thứ hai' => 1,
            'thứ 3' => 2, 'thứ ba' => 2,
            'thứ 4' => 3, 'thứ tư' => 3,
            'thứ 5' => 4, 'thứ năm' => 4,
            'thứ 6' => 5, 'thứ sáu' => 5,
            'thứ 7' => 6, 'thứ bảy' => 6,
            'chủ nhật' => 0,
        ];

        foreach ($dayMap as $key => $val) {
            if (str_contains($query, $key)) {
                $targetDate = now()->next($val)->format('Y-m-d');
                if (!in_array($targetDate, $foundDates)) {
                    $foundDates[] = $targetDate;
                }
            }
        }

        if (!empty($foundDates)) {
            // Nếu chỉ có 1 ngày thì trả về string, nhiều ngày trả về array
            $data['date'] = count($foundDates) === 1 ? $foundDates[0] : $foundDates;
        }

        // Môn thể thao phổ biến
        if (str_contains($query, 'cầu lông')) $data['sport'] = 'Cầu lông';
        if (str_contains($query, 'bóng đá')) $data['sport'] = 'Bóng đá';
        if (str_contains($query, 'tennis')) $data['sport'] = 'Tennis';
        if (str_contains($query, 'bơi lội')) $data['sport'] = 'Bơi lội';

        return (object) $data;
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

        // Use v1beta for better JSON support with Gemini 1.5 Flash
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
            - 'price_max': The maximum price per hour (integer).
            - 'time_from': Start time in 'HH:mm' format.
            - 'time_to': End time in 'HH:mm' format.
            - 'skill_level': The skill level requirement (one of: 'newbie', 'beginner', 'intermediate', 'advanced').

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
