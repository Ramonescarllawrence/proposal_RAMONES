<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatePlanController extends Controller
{
    // Landing page. Optional names: /?to=Mika&from=Alex
    public function index(Request $request)
    {
        return view('index', [
            'to'   => Str::limit(strip_tags((string) $request->query('to')), 30, ''),
            'from' => Str::limit(strip_tags((string) $request->query('from')), 30, ''),
        ]);
    }

    // Saves the finished plan as a JSON file in storage/app/private/plans (or storage/app/plans on older Laravel).
    public function store(Request $request)
    {
        $data = $request->validate([
            'to'        => 'nullable|string|max:30',
            'from'      => 'nullable|string|max:30',
            'date_type' => 'required|string|max:60',
            'day'       => 'required|date_format:Y-m-d',
            'time'      => 'required|date_format:H:i',
            'food'      => 'required|string|max:60',
        ]);

        $id = Str::lower(Str::random(10));
        Storage::put("plans/{$id}.json", json_encode($data + ['saved_at' => now()->toIso8601String()], JSON_PRETTY_PRINT));

        return response()->json(['id' => $id, 'url' => route('plan.show', $id)], 201);
    }

    // Shareable page for a saved plan.
    public function show(string $id)
    {
        abort_unless(preg_match('/^[a-z0-9]{10}$/', $id) && Storage::exists("plans/{$id}.json"), 404);

        $plan = json_decode(Storage::get("plans/{$id}.json"), true);

        return view('plan', [
            'plan'     => $plan,
            'dateType' => $plan['date_type'],
            'dayText'  => Carbon::parse($plan['day'])->format('l, F j'),
            'timeText' => Carbon::createFromFormat('H:i', $plan['time'])->format('g:i A'),
            'food'     => $plan['food'],
        ]);
    }
}
