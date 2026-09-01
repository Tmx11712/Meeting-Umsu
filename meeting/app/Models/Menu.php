<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'route',
        'icon',
        'order',
        'status',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order', 'asc');
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_has_menus');
    }
}
