// Kalkulator Kebutuhan Kalori Harian
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calorieForm');
    const resultSection = document.getElementById('result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateCalories();
    });
    
    // Fungsi utama untuk menghitung kalori
    function calculateCalories() {
        // Ambil data dari form
        const formData = new FormData(form);
        const data = {
            gender: formData.get('gender'),
            age: parseInt(formData.get('age')),
            weight: parseFloat(formData.get('weight')),
            height: parseInt(formData.get('height')),
            activity: parseFloat(formData.get('activity'))
        };
        
        // Validasi input
        if (!validateInput(data)) {
            return;
        }
        
        // Hitung BMR menggunakan rumus Mifflin-St Jeor
        const bmr = calculateBMR(data);
        
        // Hitung kebutuhan kalori harian
        const dailyCalories = Math.round(bmr * data.activity);
        
        // Hitung BMI
        const bmi = calculateBMI(data.weight, data.height);
        
        // Tampilkan hasil
        displayResults(dailyCalories, bmr, bmi, data);
    }
    
    // Validasi input pengguna
    function validateInput(data) {
        const errors = [];
        
        if (!data.gender) {
            errors.push('Pilih jenis kelamin');
        }
        
        if (!data.age || data.age < 1 || data.age > 120) {
            errors.push('Usia harus antara 1-120 tahun');
        }
        
        if (!data.weight || data.weight < 1 || data.weight > 500) {
            errors.push('Berat badan harus antara 1-500 kg');
        }
        
        if (!data.height || data.height < 50 || data.height > 250) {
            errors.push('Tinggi badan harus antara 50-250 cm');
        }
        
        if (!data.activity) {
            errors.push('Pilih tingkat aktivitas');
        }
        
        if (errors.length > 0) {
            alert('Mohon perbaiki input berikut:\\n' + errors.join('\\n'));
            return false;
        }
        
        return true;
    }
    
    // Hitung BMR menggunakan rumus Mifflin-St Jeor
    function calculateBMR(data) {
        let bmr;
        
        if (data.gender === 'male') {
            // Rumus untuk laki-laki: BMR = 10 × berat + 6.25 × tinggi - 5 × usia + 5
            bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5;
        } else {
            // Rumus untuk perempuan: BMR = 10 × berat + 6.25 × tinggi - 5 × usia - 161
            bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
        }
        
        return Math.round(bmr);
    }
    
    // Hitung BMI (Body Mass Index)
    function calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    
    // Tentukan kategori BMI
    function getBMICategory(bmi) {
        if (bmi < 18.5) {
            return { category: 'Kurus', class: 'bmi-underweight' };
        } else if (bmi < 25) {
            return { category: 'Normal', class: 'bmi-normal' };
        } else if (bmi < 30) {
            return { category: 'Gemuk', class: 'bmi-overweight' };
        } else {
            return { category: 'Obesitas', class: 'bmi-obese' };
        }
    }
    
    // Tampilkan hasil perhitungan
    function displayResults(dailyCalories, bmr, bmi, data) {
        // Update nilai hasil
        document.getElementById('dailyCalories').textContent = dailyCalories.toLocaleString('id-ID');
        document.getElementById('bmr').textContent = bmr.toLocaleString('id-ID');
        document.getElementById('bmi').textContent = bmi;
       
        // Update kategori BMI
        const bmiInfo = getBMICategory(parseFloat(bmi));
        const bmiCategoryElement = document.getElementById('bmiCategory');
        bmiCategoryElement.textContent = bmiInfo.category;
        bmiCategoryElement.className = `bmi-category ${bmiInfo.class}`;
        
        // Generate tips
        generateTips(dailyCalories, bmi, data);
        
        // Tampilkan section hasil dengan animasi
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Generate tips berdasarkan hasil
    function generateTips(dailyCalories, bmi, data) {
        const tipsList = document.getElementById('tipsList');
        const tips = [];
        
        // Tips berdasarkan BMI
        const bmiValue = parseFloat(bmi);
        if (bmiValue < 18.5) {
            tips.push('Anda perlu menambah berat badan. Konsumsi makanan bergizi tinggi dan olahraga untuk membangun massa otot.');
            tips.push('Tambahkan camilan sehat seperti kacang-kacangan, alpukat, dan protein shake.');
        } else if (bmiValue < 25) {
            tips.push('BMI Anda normal! Pertahankan pola makan seimbang dan rutin berolahraga.');
            tips.push('Konsumsi 5-6 porsi buah dan sayuran setiap hari.');
        } else if (bmiValue < 30) {
            tips.push('Anda perlu menurunkan berat badan. Kurangi 300-500 kalori dari kebutuhan harian.');
            tips.push('Tingkatkan aktivitas fisik dan kurangi makanan tinggi gula dan lemak jenuh.');
        } else {
            tips.push('Konsultasikan dengan dokter atau ahli gizi untuk program penurunan berat badan yang aman.');
            tips.push('Fokus pada perubahan gaya hidup jangka panjang, bukan diet ekstrem.');
        }
        
        // Tips berdasarkan tingkat aktivitas
        if (data.activity <= 1.375) {
            tips.push('Tingkatkan aktivitas fisik Anda. Mulai dengan jalan kaki 30 menit setiap hari.');
        } else if (data.activity >= 1.725) {
            tips.push('Pastikan asupan protein cukup (1.6-2.2g per kg berat badan) untuk pemulihan otot.');
        }
        
        // Tips umum
        tips.push('Minum air putih minimal 8 gelas per hari.');
        tips.push('Tidur yang cukup (7-9 jam) penting untuk metabolisme yang sehat.');
        tips.push('Konsumsi makanan utuh dan hindari makanan olahan berlebihan.');
        
        // Tampilkan tips
        tipsList.innerHTML = '';
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }
    
    // Animasi smooth untuk input focus
    const inputs = document.querySelectorAll('.input, .select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Auto-format angka pada input berat badan
    const weightInput = document.getElementById('weight');
    weightInput.addEventListener('input', function() {
        let value = this.value;
        if (value && !isNaN(value)) {
            // Batasi desimal maksimal 1 digit
            if (value.includes('.')) {
                const parts = value.split('.');
                if (parts[1] && parts[1].length > 1) {
                    this.value = parseFloat(value).toFixed(1);
                }
            }
        }
    });
    
    // Validasi real-time untuk input numerik
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            
            if (value < min) {
                this.setCustomValidity(`Nilai minimum adalah ${min}`);
            } else if (value > max) {
                this.setCustomValidity(`Nilai maksimum adalah ${max}`);
            } else {
                this.setCustomValidity('');
            }
        });
    });
    
    // Keyboard navigation untuk radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextRadio = this.parentElement.nextElementSibling?.querySelector('input[type="radio"]');
                if (nextRadio) {
                    nextRadio.focus();
                    nextRadio.checked = true;
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevRadio = this.parentElement.previousElementSibling?.querySelector('input[type="radio"]');
                if (prevRadio) {
                    prevRadio.focus();
                    prevRadio.checked = true;
                }
            }
        });
    });

    //
    const pageUrl = window.location.href;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`;
    const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
    
                }
            }
        });
    });
    // Loading state untuk tombol calculate
    const calculateBtn = document.querySelector('.btn-calculate');
    const originalBtnText = calculateBtn.innerHTML;
    
    form.addEventListener('submit', function() {
        calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghitung...';
        calculateBtn.disabled = true;
        
        setTimeout(() => {
            calculateBtn.innerHTML = originalBtnText;
            calculateBtn.disabled = false;
        }, 500);
    });
});

