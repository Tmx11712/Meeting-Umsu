<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meeting_transcription_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('recording_id')->constrained('meeting_recordings')->cascadeOnDelete();
            $table->integer('chunk_index');
            $table->float('start_seconds');
            $table->float('end_seconds');
            $table->float('normal_end_seconds');
            $table->string('file_path');
            $table->string('status')->default('pending'); // pending, processing, completed, failed
            $table->integer('attempts')->default(0);
            $table->text('error_message')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_transcription_chunks');
    }
};
