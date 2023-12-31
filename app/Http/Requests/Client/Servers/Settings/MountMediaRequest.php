<?php

namespace Convoy\Http\Requests\Client\Servers\Settings;

use Convoy\Http\Requests\FormRequest;
use Convoy\Models\ISO;

class MountMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        $iso = $this->parameter('iso', ISO::class);

        // check if they're authorized to mount a hidden media (iso)
        if ($iso->hidden && ! $this->user()->root_admin) {
            return false;
        }

        return true;
    }

    public function rules(): array
    {
        return [];
    }
}
