document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    if (!form) return;

    // Read URL params to pre-select plan
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');

    if (planParam) {
        const radioToSelect = document.querySelector(`input[name="plan"][value="${planParam}"]`);
        if (radioToSelect) {
            radioToSelect.checked = true;
            updateRadioStyles();
        }
    }

    // --- UI Step Logic ---
    const btnToStep2 = document.getElementById('btn-to-step-2');
    const btnToStep3 = document.getElementById('btn-to-step-3');
    const stepIndicators = document.querySelectorAll('.step-item');

    btnToStep2.addEventListener('click', () => {
        // Validate if a plan is selected
        const selectedPlan = document.querySelector('input[name="plan"]:checked');
        if (!selectedPlan) {
            alert('Vui lòng chọn 1 gói dịch vụ chính.');
            return;
        }
        window.changeStep(2);
    });

    btnToStep3.addEventListener('click', () => {
        // Basic validation
        const inputs = document.querySelectorAll('#step-2 [required]');
        let valid = true;
        inputs.forEach(input => {
            if (!input.value) valid = false;
        });

        if (!valid) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc (*).');
            return;
        }
        window.changeStep(3);
    });

    window.changeStep = function (step) {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'none';

        document.getElementById(`step-${step}`).style.display = 'block';

        stepIndicators.forEach((el, index) => {
            if (index + 1 === step) el.classList.add('active');
            else el.classList.remove('active');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Dynamic Order Summary Logic ---
    const radios = document.querySelectorAll('input[name="plan"]');
    const checkboxes = document.querySelectorAll('input[name="addons"]');

    function updateRadioStyles() {
        document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('selected'));
        const checked = document.querySelector('input[name="plan"]:checked');
        if (checked) {
            checked.closest('.radio-card').classList.add('selected');
        }
        calculateTotal();
    }

    function formatCurrency(num) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    }

    function calculateTotal() {
        let total = 0;

        // Plan
        const selectedPlan = document.querySelector('input[name="plan"]:checked');
        const planNameEl = document.getElementById('summary-plan-name');
        const planPriceEl = document.getElementById('summary-plan-price');

        if (selectedPlan) {
            const price = parseInt(selectedPlan.dataset.price);
            total += price;
            planNameEl.textContent = selectedPlan.dataset.name;
            planPriceEl.textContent = formatCurrency(price);
        } else {
            planNameEl.textContent = 'Chưa chọn gói';
            planPriceEl.textContent = '0đ';
        }

        // Addons
        const summaryAddons = document.getElementById('summary-addons');
        summaryAddons.innerHTML = '';

        checkboxes.forEach(cb => {
            if (cb.checked) {
                const price = parseInt(cb.dataset.price);
                total += price;

                const div = document.createElement('div');
                div.className = 'summary-item';
                div.style.color = "rgba(255,255,255,0.8)";
                div.style.fontSize = "0.9rem";
                div.innerHTML = `
          <span>+ ${cb.dataset.name}</span>
          <span>${formatCurrency(price)}</span>
        `;
                summaryAddons.appendChild(div);
            }
        });

        // Total
        document.getElementById('summary-total').textContent = formatCurrency(total);
    }

    radios.forEach(radio => radio.addEventListener('change', updateRadioStyles));
    checkboxes.forEach(cb => cb.addEventListener('change', calculateTotal));

    // Init
    updateRadioStyles();

    // Form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn! Yêu cầu đặt lịch đã được ghi nhận. Tết Nhàn sẽ liên hệ xác nhận trong vòng 15 phút.');
        window.location.href = 'index.html';
    });
});
