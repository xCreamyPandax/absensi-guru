<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');

    }
    
    protected $fillable = [
        'user_id',
        'leave_date',
        'reason',
        'type',
        'status',
    ];
}
