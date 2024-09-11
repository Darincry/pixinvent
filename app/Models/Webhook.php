<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Webhook extends Model
{
    protected function casts(): array
    {
        return [
            'request' => 'array',
        ];
    }
}
