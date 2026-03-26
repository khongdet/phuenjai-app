let selectedRes = '';

function goToScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function startTimer() {
    goToScreen('screen3');
    let time = 60; // ** เดโม่ 5 วินาที / ใช้งานจริงใช้ 900 **
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

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLwpDx1pPanjIX_AhAvtMZbCoPQeRNtv7OO9jGhgve3I0BxTVMr3jFul9EzFmyejk3EQ/exec';

// ฟังก์ชันแปลงรูปภาพเป็น Base64
async function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

async function submitData() {
    if (!selectedRes) { alert("กรุณาเลือกผลตรวจก่อนนะคะ"); return; }
    
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput.files.length === 0) {
        alert("กรุณาถ่ายรูปผลตรวจเพื่อเป็นหลักฐานด้วยค่ะ");
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = "กำลังส่งข้อมูล (กรุณารอสักครู่)...";
    submitBtn.disabled = true;

    try {
        // แปลงรูปภาพที่น้องถ่าย
        const imgBase64 = await getBase64(fileInput.files[0]);

        const payload = {
            qr_id: new URLSearchParams(window.location.search).get('id') || 'Walk-in',
            result: selectedRes,
            image_base64: imgBase64
        };

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
            // หมายเหตุ: ไม่ใส่ headers เพื่อเลี่ยงปัญหา CORS ของ Google Apps Script
        });

        const result = await response.json();
        
        if(result.result === "success") {
            goToScreen('screen5');
            showFinalMessage(); // เรียกใช้ฟังก์ชันด้านล่าง
        } else {
            throw new Error(result.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
        }

    } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาด: ระบบอาจจะใช้เวลาโหลดรูปภาพนานเกินไป กรุณาลองอีกครั้งค่ะ");
        submitBtn.disabled = false;
        submitBtn.innerHTML = "ส่งรายงานผลตรวจอีกครั้ง";
    }
}

// ------ ส่วนที่เติมให้สมบูรณ์ ------
function showFinalMessage() {
    const resBox = document.getElementById('result-content');
    if (selectedRes === 'negative') {
        resBox.innerHTML = `
            <h1 style="color:#00b894;">ยินดีด้วยค่ะ 🎉</h1>
            <p>ผลการตรวจปกติ รักษาสุขภาพและป้องกันตนเองสม่ำเสมอนะคะ</p>
            <button class="btn-main" onclick="location.reload()">เสร็จสิ้นการทำงาน</button>
        `;
    } else {
        resBox.innerHTML = `
            <h2 style="color:#d63031;">พี่ๆ อยู่ตรงนี้เสมอ 💖</h2>
            <p>ไม่ต้องกังวลนะคะ ปัจจุบันเอชไอวีรักษาได้และทานยาฟรีค่ะ กดปุ่มเพื่อคุยกับเจ้าหน้าที่</p>
            <button class="btn-main" style="background:#d63031; margin-top:20px;">💬 แชทคุยกับเจ้าหน้าที่คลินิกเพื่อนใจ</button>
        `;
    }
}