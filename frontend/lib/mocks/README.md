# Mock mode

Habilitar con `NEXT_PUBLIC_MOCK_MODE=true`.

Opcional:
- `NEXT_PUBLIC_FF_MOCK_DELAY_MS` (número) para simular latencia (por defecto: 220ms).

El adapter mock intercepta requests del `api` de Axios y devuelve fixtures en memoria, sin necesidad de backend.

