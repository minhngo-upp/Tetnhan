document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnRestart = document.getElementById('btn-restart');

    const quizIntro = document.getElementById('quiz-intro');
    const quizTitle = document.getElementById('quiz-title');
    const progressBar = document.getElementById('progress-bar');
    const quizControls = document.getElementById('quiz-controls');
    const quizResult = document.getElementById('quiz-result');

    let currentStep = 0; // 0 is intro, 1-5 are questions, 6 is result
    const totalQuestions = 5;
    let answers = {};

    if (!btnStart) return; // Not on quiz page

    // Hide controls initially
    progressBar.style.width = '0%';
    quizTitle.textContent = 'Trắc nghiệm Tết Nhàn';

    // Option selection logic
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function () {
            // Remove selected from siblings
            const parent = this.parentElement;
            parent.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));

            // Add selected to clicked
            this.classList.add('selected');

            // Enable next button
            btnNext.disabled = false;

            // Save answer
            const qNum = this.getAttribute('data-q');
            answers[`q${qNum}`] = this.getAttribute('data-value');
        });
    });

    function showStep(step) {
        // Hide all
        quizIntro.classList.remove('active');
        for (let i = 1; i <= totalQuestions; i++) {
            document.getElementById(`q${i}`).classList.remove('active');
        }
        quizResult.classList.remove('active');

        if (step === 0) {
            quizIntro.classList.add('active');
            quizControls.style.display = 'none';
            progressBar.style.width = '0%';
            quizTitle.textContent = 'Trắc nghiệm Tết Nhàn';
        } else if (step >= 1 && step <= totalQuestions) {
            document.getElementById(`q${step}`).classList.add('active');
            quizControls.style.display = 'flex';
            btnPrev.disabled = (step === 1);

            // Check if current question has an answer selected
            if (answers[`q${step}`]) {
                btnNext.disabled = false;
            } else {
                btnNext.disabled = true;
            }

            quizTitle.textContent = `Câu ${step}/${totalQuestions}`;
            progressBar.style.width = `${(step / totalQuestions) * 100}%`;
        } else if (step > totalQuestions) {
            // Show Result
            showResult();
        }
    }

    function showResult() {
        quizControls.style.display = 'none';
        quizTitle.textContent = 'Kết quả của bạn';
        progressBar.style.width = '100%';
        quizResult.classList.add('active');

        // Simple Recommendation Logic
        const q1 = answers.q1;
        const q2 = answers.q2;
        const q4 = answers.q4;
        const q5 = answers.q5;

        let plan = 'family_premium';
        let title = 'Tết Nhàn Family (Premium)';
        let desc = 'Tổng vệ sinh nhà cửa, trang trí mai đào và mâm cỗ Tât niên. Phù hợp cho gia đình muốn đón Tết tại nhà thảnh thơi.';

        if (q1 === 'business') {
            plan = 'biz_premium';
            title = 'Tết Nhàn Business (Premium)';
            desc = 'Quà tặng doanh nghiệp thiết kế riêng và setup tiệc Tân niên. Nâng tầm thương hiệu năm mới.';
        } else if (q2 === 'hometown' || q2 === 'travel' || q5 === 'safe') {
            plan = 'care';
            title = 'Tết Nhàn Care';
            desc = 'Trông giữ nhà, chăm sóc thú cưng và cây cảnh khi bạn vắng nhà dài ngày. Đón bạn về nhà tươm tất.';
        } else if (q4 === 'high' || q5 === 'luxury') {
            plan = 'family_elite';
            title = 'Tết Nhàn Elite';
            desc = 'Đặc quyền phục vụ chuyên gia 1-1. Từ việc sửa soạn đồ cúng tâm linh đến đầu bếp tại gia cho những bữa tiệc VIP.';
        } else if (q4 === 'low' && q1 === 'small') {
            plan = 'family_basic';
            title = 'Tết Nhàn Family (Basic)';
            desc = 'Dọn dẹp nhà cửa cơ bản và chuẩn bị mâm đồ lễ cúng Giao thừa gọn nhẹ, tiết kiệm.';
        }

        document.getElementById('result-title').textContent = title;
        document.getElementById('result-desc').textContent = desc;
        document.getElementById('result-link').href = `booking.html?plan=${plan}`;
    }

    // Button Listeners
    btnStart.addEventListener('click', () => {
        currentStep = 1;
        showStep(currentStep);
    });

    btnNext.addEventListener('click', () => {
        if (currentStep <= totalQuestions) {
            currentStep++;
            showStep(currentStep);
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    btnRestart.addEventListener('click', () => {
        currentStep = 0;
        answers = {};
        document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        showStep(currentStep);
    });
});
