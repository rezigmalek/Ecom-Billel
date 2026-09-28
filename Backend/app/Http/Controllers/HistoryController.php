<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    /**
     * Display all history records.
     */
    public function index()
    {
        $histories = History::with('user')
            ->latest()
            ->get();

        return response()->json([
            'histories' => $histories,
        ]);
    }

    /**
     * Store a new history record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'action' => ['required', 'string', 'max:255'],
            'entity' => ['required', 'string', 'max:255'],
            'entity_id' => ['required', 'integer'],
            'description' => ['nullable', 'string'],
        ]);

        $history = History::create([
            'user_id' => $request->user()->id,
            'action' => $validated['action'],
            'entity' => $validated['entity'],
            'entity_id' => $validated['entity_id'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'History created successfully',
            'history' => $history->load('user'),
        ], 201);
    }

    /**
     * Display a specific history record.
     */
    public function show(History $history)
    {
        $history->load('user');

        return response()->json([
            'history' => $history,
        ]);
    }

    /**
     * Delete a history record.
     */
    public function destroy(History $history)
    {
        $history->delete();

        return response()->json([
            'message' => 'History deleted successfully',
        ]);
    }
}