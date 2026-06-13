<?php

namespace App\Imports;

use App\Models\Participant;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Validators\Failure;

class ParticipantImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    protected int $eventId;
    protected int $importedCount = 0;
    protected int $skippedCount  = 0;
    protected array $failures    = [];

    public function __construct(int $eventId)
    {
        $this->eventId = $eventId;
    }

    public function model(array $row): ?Participant
    {
        $email = strtolower(trim($row['email'] ?? ''));

        // Skip duplikat email dalam event yang sama
        if (Participant::where('event_id', $this->eventId)->where('email', $email)->exists()) {
            $this->skippedCount++;
            return null;
        }

        $this->importedCount++;

        return new Participant([
            'event_id'    => $this->eventId,
            'nama'        => trim($row['nama'] ?? ''),
            'email'       => $email,
            'posisi'      => strtolower(trim($row['posisi'] ?? 'peserta')),
            'penghargaan' => trim($row['penghargaan'] ?? '') ?: null,
        ]);
    }

    public function rules(): array
    {
        return [
            'nama'  => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'posisi' => 'nullable|in:peserta,pemateri,moderator,panitia,juri',
        ];
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    public function getSkippedCount(): int
    {
        return $this->skippedCount;
    }

    public function getFailures(): array
    {
        return array_map(fn(Failure $f) => [
            'row'    => $f->row(),
            'errors' => $f->errors(),
        ], $this->failures());
    }
}
