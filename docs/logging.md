---
outline: deep
---

# Логирование

Cpdy предоставляет простую систему логирования. Эта система логирования позволяет сохранять сообщения двух типов `info` и `error`.

## Сообщения лога

Запись сообщений лога осуществляется вызовом одного из следующих методов:

log_info: записывает сообщение, содержащее какую-либо полезную информацию.

log_error: записывает критическую ошибку, на которую нужно, как можно скорее, обратить внимание.

Сообщения сохраняются в системном журнале `/var/log/syslog`.

---

log_print: выводит сообщение в стандартный вывод без записи в журнал.

```C
#include "http1.h"
#include "log.h"

void get(http1request_t* request, http1response_t* response) {
    log_error("Error message\n");

    response->data(response, "Error");
}
```