<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index()
    {
        $myComplaints = Task::with('technicianUser')
            ->where('client_user_id', Auth::id())
            ->where('type', 'repair')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Client/Complaints/Index', [
            'complaints' => $myComplaints,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Task::create([
            'client_user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'type' => 'repair',
            'status' => 'pending',
        ]);

        return Redirect::route('client.complaints.index');
    }
}