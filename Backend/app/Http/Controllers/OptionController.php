<?php

namespace App\Http\Controllers;

use App\Models\Option;
use Illuminate\Http\Request;

class OptionController extends Controller
{
    public function index()
    {
        $options = Option::with('values')->get();

        return response()->json([
            'options' => $options,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:options,name'],
        ]);

        $option = Option::create($validated);

        return response()->json([
            'message' => 'Option created successfully',
            'option' => $option,
        ], 201);
    }

    public function show(Option $option)
    {
        $option->load('values');

        return response()->json([
            'option' => $option,
        ]);
    }

    public function update(Request $request, Option $option)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:options,name,' . $option->id,
            ],
        ]);

        $option->update($validated);

        return response()->json([
            'message' => 'Option updated successfully',
            'option' => $option,
        ]);
    }

    public function destroy(Option $option)
    {
        $option->delete();

        return response()->json([
            'message' => 'Option deleted successfully',
        ]);
    }
}