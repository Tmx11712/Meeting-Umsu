<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('route')->nullable();
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('status')->default(true);
            $table->uuid('parent_id')->nullable()->index();
            $table->timestamps();
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('menus')->cascadeOnDelete();
        });

        Schema::create('role_has_menus', function (Blueprint $table) {
            $table->uuid('role_id');
            $table->uuid('menu_id');

            // Wait, we need to know the roles table name, usually 'roles'
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('menu_id')->references('id')->on('menus')->onDelete('cascade');

            $table->primary(['role_id', 'menu_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_has_menus');
        Schema::dropIfExists('menus');
    }
};
