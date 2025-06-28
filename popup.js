document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const launcherStatus = document.getElementById('launcher-status');
    const configContainer = document.getElementById('config-container');
    const addKeybindButton = document.getElementById('add-keybind');
    const saveCurrentUrlButton = document.getElementById('save-current-url-btn');
    const saveModal = document.getElementById('save-modal');

    let keybinds = {};

    const loadKeybinds = async () => {
        const result = await chrome.storage.sync.get(['keybinds']);
        keybinds = result.keybinds || {};
        renderConfig();
    };

    const saveKeybinds = () => {
        return chrome.storage.sync.set({ keybinds });
    };

    const createIcon = (name) => {
        const svgNS = 'http://www.w3.org/2000/svg';
        const icon = document.createElementNS(svgNS, 'svg');
        icon.setAttribute('width', '16');
        icon.setAttribute('height', '16');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');

        const path = document.createElementNS(svgNS, 'path');
        if (name === 'save') {
            path.setAttribute('d', 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z');
        } else if (name === 'delete') {
            path.setAttribute('d', 'M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z');
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', '18');
            line.setAttribute('y1', '9');
            line.setAttribute('x2', '12');
            line.setAttribute('y2', '15');
            icon.appendChild(line);
            const line2 = document.createElementNS(svgNS, 'line');
            line2.setAttribute('x1', '12');
            line2.setAttribute('y1', '9');
            line2.setAttribute('x2', '18');
            line2.setAttribute('y2', '15');
            icon.appendChild(line2);
        }
        icon.appendChild(path);
        return icon;
    };

    const renderConfig = () => {
        configContainer.innerHTML = '';
        Object.entries(keybinds).forEach(([key, url]) => {
            const settingDiv = document.createElement('div');
            settingDiv.classList.add('setting');

            const keyInput = document.createElement('input');
            keyInput.type = 'text';
            keyInput.value = key;
            keyInput.maxLength = 1;
            keyInput.placeholder = 'Key';
            keyInput.classList.add('key-input');
            keyInput.dataset.oldKey = key;

            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.value = url;
            urlInput.placeholder = 'Enter URL';
            urlInput.classList.add('url-input');

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('config-buttons');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.appendChild(createIcon('delete'));

            buttonContainer.appendChild(deleteButton);
            settingDiv.appendChild(keyInput);
            settingDiv.appendChild(urlInput);
            settingDiv.appendChild(buttonContainer);
            configContainer.appendChild(settingDiv);

            keyInput.addEventListener('input', () => {
                if (keyInput.value) urlInput.focus();
            });

            const saveChanges = async () => {
                const newKey = keyInput.value.toLowerCase();
                const oldKey = keyInput.dataset.oldKey;
                const newUrl = urlInput.value;

                if (newKey && newUrl) {
                    if (newKey !== oldKey) {
                        delete keybinds[oldKey];
                    }
                    keybinds[newKey] = newUrl;
                    await saveKeybinds();
                    renderConfig();
                } else if (!newKey && oldKey) { // If key is cleared, delete the entry
                    delete keybinds[oldKey];
                    await saveKeybinds();
                    renderConfig();
                }
            };

            keyInput.addEventListener('blur', saveChanges);
            urlInput.addEventListener('blur', saveChanges);

            deleteButton.addEventListener('click', async () => {
                delete keybinds[key];
                await saveKeybinds();
                renderConfig();
            });
        });
    };

    addKeybindButton.addEventListener('click', () => {
        const newKeyInput = document.createElement('input');
        newKeyInput.type = 'text';
        newKeyInput.maxLength = 1;
        newKeyInput.placeholder = 'Key';
        newKeyInput.classList.add('key-input');

        const newUrlInput = document.createElement('input');
        newUrlInput.type = 'text';
        newUrlInput.placeholder = 'Enter URL';
        newUrlInput.classList.add('url-input');

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.appendChild(createIcon('delete'));

        const settingDiv = document.createElement('div');
        settingDiv.classList.add('setting');
        settingDiv.appendChild(newKeyInput);
        settingDiv.appendChild(newUrlInput);
        settingDiv.appendChild(deleteButton);

        configContainer.appendChild(settingDiv);
        newKeyInput.focus();

        const saveChanges = async () => {
            const newKey = newKeyInput.value.toLowerCase();
            const newUrl = newUrlInput.value;
            if (newKey && newUrl) {
                keybinds[newKey] = newUrl;
                await saveKeybinds();
                renderConfig();
            } else if (!newKey && newUrl) { // If URL is entered but key is not, remove it
                // This case should ideally not happen if keyInput is focused first
            }
        };

        newKeyInput.addEventListener('blur', saveChanges);
        newUrlInput.addEventListener('blur', saveChanges);

        newKeyInput.addEventListener('input', () => {
            if (newKeyInput.value) newUrlInput.focus();
        });

        deleteButton.addEventListener('click', async () => {
            // Find the key associated with this new entry if it was saved
            const keyToDelete = newKeyInput.value.toLowerCase();
            if (keybinds[keyToDelete]) {
                delete keybinds[keyToDelete];
                await saveKeybinds();
            }
            renderConfig();
        });
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    const handleGlobalKeydown = (event) => {
        if (saveModal.style.display === 'flex') return;

        if (document.getElementById('launcher').classList.contains('active')) {
            const key = event.key.toLowerCase();
            if (keybinds[key]) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const currentTab = tabs[0];
                    if (currentTab && (currentTab.url === "chrome://newtab/" || currentTab.url === "about:newtab")) {
                        chrome.tabs.update(currentTab.id, { url: keybinds[key] });
                    } else {
                        chrome.tabs.create({ url: keybinds[key] });
                    }
                });
                window.close();
            } else if (event.key === 'Escape') {
                window.close();
            } else {
                launcherStatus.textContent = `No URL set for '${key}'`;
            }
        }
    };

    document.addEventListener('keydown', handleGlobalKeydown);

    saveCurrentUrlButton.addEventListener('click', () => {
        saveModal.style.display = 'flex';

        const keydownHandler = async (event) => {
            if (event.key === 'Escape') {
                saveModal.style.display = 'none';
                document.removeEventListener('keydown', keydownHandler);
                return;
            }

            const key = event.key.toLowerCase();
            if (key && key.length === 1 && !keybinds[key]) {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                keybinds[key] = tab.url;
                await saveKeybinds();
                renderConfig();
                saveModal.style.display = 'none';
                document.removeEventListener('keydown', keydownHandler);
            }
        };
        document.addEventListener('keydown', keydownHandler);
    });

    loadKeybinds();
});