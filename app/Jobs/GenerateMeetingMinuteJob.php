<?php

namespace App\Jobs;

use App\Actions\Meetings\GenerateMeetingMinuteAction;
use App\Events\MeetingUpdated;
use App\Models\Meeting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateMeetingMinuteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Berikan waktu maksimal 5 menit untuk job ini sebelum dianggap timeout.
     */
    public $timeout = 300;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Meeting $meeting
    ) {}

    /**
     * Execute the job.
     */
    public function handle(GenerateMeetingMinuteAction $action): void
    {
        try {
            Log::info("Starting background AI summary generation for meeting ID: {$this->meeting->id}");
            $action->execute($this->meeting);

            $freshMeeting = $this->meeting->fresh() ?? $this->meeting;
            $freshMeeting->ai_status = 'completed';
            $freshMeeting->save();
            safe_broadcast(new MeetingUpdated($freshMeeting, 'stage_changed'));

            Log::info("Successfully generated AI summary for meeting ID: {$this->meeting->id}");
        } catch (\Throwable $e) {
            $freshMeeting = $this->meeting->fresh() ?? $this->meeting;
            $freshMeeting->ai_status = 'failed';
            $freshMeeting->save();
            safe_broadcast(new MeetingUpdated($freshMeeting, 'stage_changed'));

            Log::error("Failed to generate AI summary for meeting ID: {$this->meeting->id}. Error: ".$e->getMessage());
            throw $e;
        }
    }

    public function failed(?\Throwable $exception = null): void
    {
        $meeting = $this->meeting->fresh();
        if ($meeting && $meeting->ai_status !== 'completed') {
            $meeting->ai_status = 'failed';
            $meeting->save();
            safe_broadcast(new MeetingUpdated($meeting, 'stage_changed'));
        }

        Log::error("GenerateMeetingMinuteJob permanently failed for meeting ID: {$this->meeting->id}", [
            'error' => $exception?->getMessage(),
        ]);
    }
}
