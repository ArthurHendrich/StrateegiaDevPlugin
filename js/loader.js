"use strict";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'StrateegiaGetOptions') {
        chrome.storage.sync.get(DefaultExtensionOptions2, function (opts) {
            sendResponse({ requestId: request.id, data: opts });
        });
    }

    return true; // para manter a porta do sendResponse aberta para resposta assíncrona
});
