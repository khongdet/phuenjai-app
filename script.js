let selectedRes = '';

function goToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function startTimer() {
    goToScreen('screen3');
    let time = 5; // ** เดโม่ 5 วินาที / ใช้งานจริงใช้ 900 **
    const display = document.getElementById('countdown');
    const btn = document.getElementById('cameraBtn');

    const countdown = setInterval(() => {
        time--;
        let m = Math.floor(time / 60);
        let s = time % 60;
        display.textContent = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
        if (time <= 0) {
            clearInterval(countdown);
            btn.disabled = false;
            btn.classList.remove('disabled');
            btn.innerHTML = "📸 ถ่ายรูปและแจ้งผลตรวจ";
        }
    }, 1000);
}

function selectResult(btn, val) {
    document.querySelectorAll('.res-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedRes = val;
}

function submitData() {
    if (!selectedRes) { alert("กรุณาเลือกผลตรวจก่อนนะคะ"); return; }
    goToScreen('screen5');
    const resBox = document.getElementById('result-content');
    if (selectedRes === 'negative') {
        resBox.innerHTML = `<h1 style="color:#00b894;">ยินดีด้วยค่ะ 🎉</h1><p>รักษาสุขภาพและป้องกันตนเองสม่ำเสมอนะคะ</p><button class="btn-main" onclick="location.reload()">เสร็จสิ้น</button>`;
    } else {
        resBox.innerHTML = `<h2 style="color:#d63031;">พี่ๆ อยู่ตรงนี้เสมอ 💖</h2><p>ไม่ต้องกังวลนะคะ เอชไอวีรักษาได้และทานยาฟรีค่ะ กดคุยกับพี่ๆ ได้เลยนะ</p><button class="btn-main" style="background:#d63031;">💬 แชทคุยกับพี่คลินิกเพื่อนใจ</button>`;
    }
}