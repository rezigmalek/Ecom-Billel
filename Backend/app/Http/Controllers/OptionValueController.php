<?php

namespace App\Http\Controllers;

use App\Models\OptionValue;
use Illuminate\Http\Request;

class OptionValueController extends Controller
{
    public function index()
    {
        $optionValues = OptionValue::with('option')->get();

        return response()->json([
            'option_values' => $optionValues,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'option_id' => ['required', 'exists:options,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $optionValue = OptionValue::create($validated);

        return response()->json([
            'message' => 'Option value created successfully',
            'option_value' => $optionValue,
        ], 201);
    }

    public function show(OptionValue $optionValue)
    {
        $optionValue->load('option');

        return response()->json([
            'option_value' => $optionValue,
        ]);
    }

    public function update(Request $request, OptionValue $optionValue)
    {
        $validated = $request->validate([
            'option_id' => ['required', 'exists:options,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $optionValue->update($validated);

        return response()->json([
            'message' => 'Option value updated successfully',
            'option_value' => $optionValue,
        ]);
    }

    public function destroy(OptionValue $optionValue)
    {
        $optionValue->delete();

        return response()->json([
            'message' => 'Option value deleted successfully',
        ]);
    }
}