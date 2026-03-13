<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VenueController extends Controller
{
    /**
     * GET /api/venues
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Venue::latest()->get()
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
}
