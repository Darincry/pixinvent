<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\TransactionResource;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $itemsPerPage = $request->input('itemsPerPage', 5);
        $paymentStatus = $request->input('paymentStatus');
        $paymentDate = $request->input('paymentDate');
        $userId = $request->input('userId');
        $sortBy = $request->input('sortBy', 'id');
        $orderBy = $request->input('orderBy', 'asc');
        // dd($paymentDate);

        $transactions = Transaction::with('user');
        $transactions->when($userId, fn ($transaction) => $transaction->where('user_id', $userId));
        $transactions->when($paymentDate, fn (Builder $transaction) => $transaction->whereBetween('created_at', json_decode($paymentDate)));
        $transactions->when($paymentStatus, fn ($transaction) => $transaction->where('status', $paymentStatus));
        $transactions->when($sortBy, fn ($transaction) => $transaction->orderBy($sortBy, $orderBy));

        return TransactionResource::collection($transactions->paginate($itemsPerPage));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users'],
            'service' => ['required'],
            'status' => ['required'],
            'amount' => ['required', 'integer'],
            'income_amount' => ['nullable', 'integer'],
            'payment_method' => ['nullable'],
            'refunded_amount' => ['nullable'],
        ]);

        return new TransactionResource(Transaction::create($data));
    }

    public function show(Transaction $transaction)
    {
        return new TransactionResource($transaction);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users'],
            'service' => ['required'],
            'status' => ['required'],
            'amount' => ['required', 'integer'],
            'income_amount' => ['nullable', 'integer'],
            'payment_method' => ['nullable'],
            'refunded_amount' => ['nullable'],
        ]);

        $transaction->update($data);

        return new TransactionResource($transaction);
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();

        return response()->json();
    }
}
