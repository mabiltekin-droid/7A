const App = {
    data: {
        settings: {
            className: '',
            classLevel: '',
            term: '',
            schoolYear: ''
        },
        students: [],
        teachers: [],
        subjects: [],
        grades: [],
        schedule: [],
        exams: [],
        attendance: []
    },
    currentPage: 'dashboard',

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateClassInfo();
        this.navigate('dashboard');
    },

    loadData() {
        const saved = localStorage.getItem('schoolData');
        if (saved) {
            this.data = JSON.parse(saved);
        }
    },

    saveData() {
        localStorage.setItem('schoolData', JSON.stringify(this.data));
    },

    updateClassInfo() {
        const classInfo = document.getElementById('classInfo');
        if (this.data.settings.className) {
            classInfo.querySelector('span').textContent = `${this.data.settings.className} - ${this.data.settings.schoolYear || ''}`;
        }
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigate(page);
            });
        });

        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
    },

    navigate(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        this.renderPage(page);
    },

    renderPage(page) {
        const content = document.getElementById('pageContent');
        const pages = {
            dashboard: this.renderDashboard,
            students: this.renderStudents,
            grades: this.renderGrades,
            schedule: this.renderSchedule,
            exams: this.renderExams,
            attendance: this.renderAttendance,
            teachers: this.renderTeachers,
            settings: this.renderSettings
        };
        content.innerHTML = (pages[page] || pages.dashboard).call(this);
        this.attachPageListeners(page);
    },

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    },

    showModal(title, content, buttons = []) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modalFooter').innerHTML = buttons.map(btn => 
            `<button class="btn ${btn.class || 'btn-secondary'}" onclick="${btn.action}">${btn.text}</button>`
        ).join('');
        document.getElementById('modal').classList.add('active');
    },

    closeModal() {
        document.getElementById('modal').classList.remove('active');
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sinif-verileri-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        this.showToast('Veriler dışa aktarıldı!');
    },

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                this.data = { ...this.data, ...imported };
                this.saveData();
                this.updateClassInfo();
                this.renderPage(this.currentPage);
                this.showToast('Veriler içe aktarıldı!');
            } catch (err) {
                this.showToast('Geçersiz dosya formatı!', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    },

    handleSearch(query) {
        if (!query) return;
        const students = this.data.students.filter(s => 
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.number.toString().includes(query)
        );
        if (students.length > 0) {
            this.navigate('students');
            document.getElementById('studentSearch') && (document.getElementById('studentSearch').value = query);
        }
    },

    renderDashboard() {
        const totalStudents = this.data.students.length;
        const totalTeachers = this.data.teachers.length;
        const upcomingExams = this.data.exams.filter(e => new Date(e.date) >= new Date()).length;
        const avgGrade = this.data.grades.length > 0 
            ? (this.data.grades.reduce((a, g) => a + (parseFloat(g.score) || 0), 0) / this.data.grades.length).toFixed(1)
            : '-';

        return `
            <div class="page-header">
                <h1 class="page-title">Ana Panel</h1>
                <button class="btn btn-primary" onclick="App.navigate('students')">
                    <i class="fas fa-plus"></i> Yeni Öğrenci Ekle
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-user-graduate"></i></div>
                    <div class="stat-info">
                        <h4>${totalStudents}</h4>
                        <p>Toplam Öğrenci</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-chalkboard-teacher"></i></div>
                    <div class="stat-info">
                        <h4>${totalTeachers}</h4>
                        <p>Öğretmen Sayısı</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-file-alt"></i></div>
                    <div class="stat-info">
                        <h4>${upcomingExams}</h4>
                        <p>Yaklaşan Deneme</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info">
                        <h4>${avgGrade}</h4>
                        <p>Ortalama Not</p>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Yaklaşan Denemeler</span>
                        <button class="btn btn-secondary" onclick="App.navigate('exams')">Tümü</button>
                    </div>
                    ${this.renderUpcomingExams()}
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Son Eklenen Öğrenciler</span>
                        <button class="btn btn-secondary" onclick="App.navigate('students')">Tümü</button>
                    </div>
                    ${this.renderRecentStudents()}
                </div>
            </div>
        `;
    },

    renderUpcomingExams() {
        const upcoming = this.data.exams
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

        if (upcoming.length === 0) {
            return '<p class="empty-state">Henüz deneme eklenmedi</p>';
        }

        return upcoming.map(exam => {
            const date = new Date(exam.date);
            return `
                <div style="display: flex; align-items: center; gap: 15px; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                    <div class="exam-date" style="padding: 8px;">
                        <div class="day">${date.getDate()}</div>
                        <div class="month">${['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][date.getMonth()]}</div>
                    </div>
                    <div>
                        <h4>${exam.name}</h4>
                        <p style="font-size: 12px; color: var(--gray-500);">${exam.subject || 'Genel'}</p>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderRecentStudents() {
        const recent = this.data.students.slice(-5).reverse();
        if (recent.length === 0) {
            return '<p class="empty-state">Henüz öğrenci eklenmedi</p>';
        }

        return recent.map(student => `
            <div style="display: flex; align-items: center; gap: 15px; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                <div class="student-avatar">${student.name.charAt(0)}</div>
                <div>
                    <h4>${student.name}</h4>
                    <p style="font-size: 12px; color: var(--gray-500);">No: ${student.number}</p>
                </div>
            </div>
        `).join('');
    },

    renderStudents() {
        return `
            <div class="page-header">
                <h1 class="page-title">Öğrenci Yönetimi</h1>
                <button class="btn btn-primary" onclick="App.showStudentModal()">
                    <i class="fas fa-plus"></i> Yeni Öğrenci
                </button>
            </div>

            <div class="search-filter">
                <input type="text" id="studentSearch" placeholder="Öğrenci ara..." oninput="App.filterStudents()">
                <select id="studentSort">
                    <option value="number">Numara</option>
                    <option value="name">İsim</option>
                </select>
            </div>

            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Ad Soyad</th>
                                <th>Cinsiyet</th>
                                <th>Doğum Tarihi</th>
                                <th>Veli</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody id="studentsTable">
                            ${this.renderStudentsTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderStudentsTable(students = null) {
        const list = students || this.data.students.sort((a, b) => a.number - b.number);
        if (list.length === 0) {
            return '<tr><td colspan="6" style="text-align: center; padding: 30px;">Henüz öğrenci eklenmedi</td></tr>';
        }
        return list.map(s => `
            <tr>
                <td>${s.number}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="student-avatar" style="width: 35px; height: 35px; font-size: 14px;">${s.name.charAt(0)}</div>
                        ${s.name}
                    </div>
                </td>
                <td>${s.gender === 'male' ? 'Erkek' : 'Kız'}</td>
                <td>${s.birthDate || '-'}</td>
                <td>${s.parentName || '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn view" onclick="App.viewStudent('${s.id}')" title="Görüntüle">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="App.showStudentModal('${s.id}')" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="App.deleteStudent('${s.id}')" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    filterStudents() {
        const query = document.getElementById('studentSearch').value.toLowerCase();
        const sort = document.getElementById('studentSort').value;
        let filtered = this.data.students.filter(s => 
            s.name.toLowerCase().includes(query) ||
            s.number.toString().includes(query)
        );
        if (sort === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            filtered.sort((a, b) => a.number - b.number);
        }
        document.getElementById('studentsTable').innerHTML = this.renderStudentsTable(filtered);
    },

    showStudentModal(id = null) {
        const student = id ? this.data.students.find(s => s.id === id) : null;
        const content = `
            <form id="studentForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Öğrenci No *</label>
                        <input type="number" name="number" value="${student?.number || ''}" required min="1">
                    </div>
                    <div class="form-group">
                        <label>Cinsiyet</label>
                        <select name="gender">
                            <option value="male" ${student?.gender === 'male' ? 'selected' : ''}>Erkek</option>
                            <option value="female" ${student?.gender === 'female' ? 'selected' : ''}>Kız</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Ad Soyad *</label>
                    <input type="text" name="name" value="${student?.name || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Doğum Tarihi</label>
                        <input type="date" name="birthDate" value="${student?.birthDate || ''}">
                    </div>
                    <div class="form-group">
                        <label>TC Kimlik No</label>
                        <input type="text" name="tcNo" value="${student?.tcNo || ''}" maxlength="11">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Veli Adı</label>
                        <input type="text" name="parentName" value="${student?.parentName || ''}">
                    </div>
                    <div class="form-group">
                        <label>Veli Telefon</label>
                        <input type="tel" name="parentPhone" value="${student?.parentPhone || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Adres</label>
                    <textarea name="address" rows="2">${student?.address || ''}</textarea>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Güncelle' : 'Kaydet', class: 'btn-primary', action: `App.saveStudent('${id || ''}')` }
        ];
        this.showModal(id ? 'Öğrenci Düzenle' : 'Yeni Öğrenci', content, buttons);
    },

    saveStudent(id) {
        const form = document.getElementById('studentForm');
        const formData = new FormData(form);
        const studentData = {
            number: parseInt(formData.get('number')),
            name: formData.get('name'),
            gender: formData.get('gender'),
            birthDate: formData.get('birthDate'),
            tcNo: formData.get('tcNo'),
            parentName: formData.get('parentName'),
            parentPhone: formData.get('parentPhone'),
            address: formData.get('address')
        };

        if (id) {
            const index = this.data.students.findIndex(s => s.id === id);
            this.data.students[index] = { ...this.data.students[index], ...studentData };
        } else {
            if (this.data.students.some(s => s.number === studentData.number)) {
                this.showToast('Bu öğrenci numarası zaten kullanılıyor!', 'error');
                return;
            }
            this.data.students.push({ id: this.generateId(), ...studentData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Öğrenci güncellendi!' : 'Öğrenci eklendi!');
    },

    deleteStudent(id) {
        if (confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) {
            this.data.students = this.data.students.filter(s => s.id !== id);
            this.data.grades = this.data.grades.filter(g => g.studentId !== id);
            this.data.attendance = this.data.attendance.filter(a => a.studentId !== id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Öğrenci silindi!');
        }
    },

    viewStudent(id) {
        const student = this.data.students.find(s => s.id === id);
        const grades = this.data.grades.filter(g => g.studentId === id);
        const attendance = this.data.attendance.filter(a => a.studentId === id);
        
        const avgGrade = grades.length > 0 
            ? (grades.reduce((a, g) => a + parseFloat(g.score), 0) / grades.length).toFixed(1)
            : '-';
        
        const presentDays = attendance.filter(a => a.status === 'present').length;
        const absentDays = attendance.filter(a => a.status === 'absent').length;

        const content = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div class="student-avatar" style="width: 80px; height: 80px; font-size: 32px; margin: 0 auto 10px;">${student.name.charAt(0)}</div>
                <h2>${student.name}</h2>
                <p style="color: var(--gray-500);">No: ${student.number}</p>
            </div>
            
            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card" style="padding: 15px;">
                    <div class="stat-info">
                        <h4>${avgGrade}</h4>
                        <p>Ortalama Not</p>
                    </div>
                </div>
                <div class="stat-card" style="padding: 15px;">
                    <div class="stat-info">
                        <h4 style="color: var(--secondary);">${presentDays}</h4>
                        <p>Devamsız</p>
                    </div>
                </div>
                <div class="stat-card" style="padding: 15px;">
                    <div class="stat-info">
                        <h4 style="color: var(--danger);">${absentDays}</h4>
                        <p>Devamsız</p>
                    </div>
                </div>
            </div>

            <h4 style="margin-bottom: 10px;">Öğrenci Bilgileri</h4>
            <table style="width: 100%; font-size: 14px;">
                <tr><td style="padding: 8px; color: var(--gray-500);">Cinsiyet</td><td>${student.gender === 'male' ? 'Erkek' : 'Kız'}</td></tr>
                <tr><td style="padding: 8px; color: var(--gray-500);">Doğum Tarihi</td><td>${student.birthDate || '-'}</td></tr>
                <tr><td style="padding: 8px; color: var(--gray-500);">TC Kimlik</td><td>${student.tcNo || '-'}</td></tr>
                <tr><td style="padding: 8px; color: var(--gray-500);">Veli</td><td>${student.parentName || '-'}</td></tr>
                <tr><td style="padding: 8px; color: var(--gray-500);">Veli Tel</td><td>${student.parentPhone || '-'}</td></tr>
            </table>
        `;
        this.showModal('Öğrenci Detay', content, [
            { text: 'Kapat', action: 'App.closeModal()' }
        ]);
    },

    renderGrades() {
        const subjects = [...new Set(this.data.grades.map(g => g.subject))];
        
        return `
            <div class="page-header">
                <h1 class="page-title">Not Sistemi</h1>
                <button class="btn btn-primary" onclick="App.showGradeModal()">
                    <i class="fas fa-plus"></i> Not Ekle
                </button>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Not İstatistikleri</span>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue"><i class="fas fa-file-alt"></i></div>
                        <div class="stat-info">
                            <h4>${this.data.grades.length}</h4>
                            <p>Toplam Not</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-info">
                            <h4>${this.data.grades.filter(g => parseFloat(g.score) >= 50).length}</h4>
                            <p>Geçen Öğrenci</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon red"><i class="fas fa-times-circle"></i></div>
                        <div class="stat-info">
                            <h4>${this.data.grades.filter(g => parseFloat(g.score) < 50).length}</h4>
                            <p>Kalan Öğrenci</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Not Listesi</span>
                    <select id="gradeFilterSubject" onchange="App.filterGrades()" style="padding: 5px 10px; border: 1px solid var(--gray-300); border-radius: var(--radius);">
                        <option value="">Tüm Dersler</option>
                        ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Öğrenci</th>
                                <th>Ders</th>
                                <th>Sınav Türü</th>
                                <th>Puan</th>
                                <th>Tarih</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody id="gradesTable">
                            ${this.renderGradesTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderGradesTable(grades = null) {
        const list = grades || this.data.grades.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (list.length === 0) {
            return '<tr><td colspan="6" style="text-align: center; padding: 30px;">Henüz not eklenmedi</td></tr>';
        }
        return list.map(g => {
            const student = this.data.students.find(s => s.id === g.studentId);
            const score = parseFloat(g.score);
            const badge = score >= 85 ? 'badge-success' : score >= 50 ? 'badge-warning' : 'badge-danger';
            return `
                <tr>
                    <td>${student?.name || 'Bilinmiyor'}</td>
                    <td>${g.subject}</td>
                    <td>${g.examType}</td>
                    <td><span class="badge ${badge}">${score}</span></td>
                    <td>${g.date}</td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn edit" onclick="App.showGradeModal('${g.id}')"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete" onclick="App.deleteGrade('${g.id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    filterGrades() {
        const subject = document.getElementById('gradeFilterSubject').value;
        const filtered = subject ? this.data.grades.filter(g => g.subject === subject) : null;
        document.getElementById('gradesTable').innerHTML = this.renderGradesTable(filtered);
    },

    showGradeModal(id = null) {
        const grade = id ? this.data.grades.find(g => g.id === id) : null;
        const examTypes = ['Yazılı', 'Sözlü', 'Performans', 'Proje', 'Quiz'];
        
        const content = `
            <form id="gradeForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Öğrenci *</label>
                        <select name="studentId" required>
                            <option value="">Seçin...</option>
                            ${this.data.students.map(s => `<option value="${s.id}" ${grade?.studentId === s.id ? 'selected' : ''}>${s.name} (${s.number})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ders *</label>
                        <input type="text" name="subject" list="subjects" value="${grade?.subject || ''}" required>
                        <datalist id="subjects">
                            ${[...new Set(this.data.grades.map(g => g.subject))].map(s => `<option value="${s}">`).join('')}
                        </datalist>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Sınav Türü *</label>
                        <select name="examType" required>
                            <option value="">Seçin...</option>
                            ${examTypes.map(t => `<option value="${t}" ${grade?.examType === t ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Puan *</label>
                        <input type="number" name="score" value="${grade?.score || ''}" required min="0" max="100">
                    </div>
                </div>
                <div class="form-group">
                    <label>Tarih</label>
                    <input type="date" name="date" value="${grade?.date || new Date().toISOString().split('T')[0]}">
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Güncelle' : 'Kaydet', class: 'btn-primary', action: `App.saveGrade('${id || ''}')` }
        ];
        this.showModal(id ? 'Not Düzenle' : 'Yeni Not', content, buttons);
    },

    saveGrade(id) {
        const form = document.getElementById('gradeForm');
        const formData = new FormData(form);
        const gradeData = {
            studentId: formData.get('studentId'),
            subject: formData.get('subject'),
            examType: formData.get('examType'),
            score: formData.get('score'),
            date: formData.get('date') || new Date().toISOString().split('T')[0]
        };

        if (id) {
            const index = this.data.grades.findIndex(g => g.id === id);
            this.data.grades[index] = { ...this.data.grades[index], ...gradeData };
        } else {
            this.data.grades.push({ id: this.generateId(), ...gradeData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Not güncellendi!' : 'Not eklendi!');
    },

    deleteGrade(id) {
        if (confirm('Bu notu silmek istediğinize emin misiniz?')) {
            this.data.grades = this.data.grades.filter(g => g.id !== id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Not silindi!');
        }
    },

    renderSchedule() {
        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
        const timeSlots = ['08:00-08:40', '08:50-09:30', '09:40-10:20', '10:30-11:10', '11:20-12:00', '13:00-13:40', '13:50-14:30', '14:40-15:20'];

        return `
            <div class="page-header">
                <h1 class="page-title">Ders Programı</h1>
                <button class="btn btn-primary" onclick="App.showScheduleModal()">
                    <i class="fas fa-plus"></i> Ders Ekle
                </button>
            </div>

            <div class="card">
                <div class="schedule-grid">
                    <div class="schedule-header">Saat</div>
                    ${days.map(d => `<div class="schedule-header">${d}</div>`).join('')}
                    
                    ${timeSlots.map((slot, i) => `
                        <div class="schedule-time">${slot}</div>
                        ${days.map((day, j) => {
                            const lessons = this.data.schedule.filter(s => s.day === j && s.hour === i);
                            return `<div class="schedule-cell">
                                ${lessons.map(l => `
                                    <div class="lesson">
                                        <div class="lesson-name">${l.subject}</div>
                                        <div class="lesson-teacher">${this.data.teachers.find(t => t.id === l.teacherId)?.name || ''}</div>
                                    </div>
                                `).join('')}
                            </div>`;
                        }).join('')}
                    `).join('')}
                </div>
            </div>
        `;
    },

    showScheduleModal() {
        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
        const timeSlots = ['08:00-08:40', '08:50-09:30', '09:40-10:20', '10:30-11:10', '11:20-12:00', '13:00-13:40', '13:50-14:30', '14:40-15:20'];

        const content = `
            <form id="scheduleForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Gün *</label>
                        <select name="day" required>
                            <option value="">Seçin...</option>
                            ${days.map((d, i) => `<option value="${i}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Saat *</label>
                        <select name="hour" required>
                            <option value="">Seçin...</option>
                            ${timeSlots.map((t, i) => `<option value="${i}">${t}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Ders *</label>
                        <input type="text" name="subject" required>
                    </div>
                    <div class="form-group">
                        <label>Öğretmen</label>
                        <select name="teacherId">
                            <option value="">Seçin...</option>
                            ${this.data.teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: 'App.saveSchedule()' }
        ];
        this.showModal('Ders Ekle', content, buttons);
    },

    saveSchedule() {
        const form = document.getElementById('scheduleForm');
        const formData = new FormData(form);
        const scheduleData = {
            day: parseInt(formData.get('day')),
            hour: parseInt(formData.get('hour')),
            subject: formData.get('subject'),
            teacherId: formData.get('teacherId') || null
        };

        const exists = this.data.schedule.find(s => s.day === scheduleData.day && s.hour === scheduleData.hour);
        if (exists) {
            const index = this.data.schedule.indexOf(exists);
            this.data.schedule[index] = { ...this.data.schedule[index], ...scheduleData };
        } else {
            this.data.schedule.push({ id: this.generateId(), ...scheduleData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Ders programı güncellendi!');
    },

    renderExams() {
        const upcoming = this.data.exams.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
        const past = this.data.exams.filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date) - new Date(a.date));

        return `
            <div class="page-header">
                <h1 class="page-title">Deneme Çizelgesi</h1>
                <button class="btn btn-primary" onclick="App.showExamModal()">
                    <i class="fas fa-plus"></i> Deneme Ekle
                </button>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Yaklaşan Denemeler</span>
                </div>
                ${upcoming.length > 0 ? upcoming.map(exam => this.renderExamCard(exam)).join('') : '<p class="empty-state">Yaklaşan deneme yok</p>'}
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Geçmiş Denemeler</span>
                </div>
                ${past.length > 0 ? past.map(exam => this.renderExamCard(exam)).join('') : '<p class="empty-state">Geçmiş deneme yok</p>'}
            </div>
        `;
    },

    renderExamCard(exam) {
        const date = new Date(exam.date);
        const isPast = date < new Date();
        return `
            <div class="exam-card">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="exam-date">
                        <div class="day">${date.getDate()}</div>
                        <div class="month">${['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][date.getMonth()]}</div>
                    </div>
                    <div class="exam-info">
                        <h4>${exam.name}</h4>
                        <p>${exam.subject || 'Genel'} • ${exam.duration || '-'} dk • ${exam.location || '-'}</p>
                    </div>
                </div>
                <div class="action-btns">
                    ${!isPast ? `<button class="action-btn edit" onclick="App.showExamModal('${exam.id}')"><i class="fas fa-edit"></i></button>` : ''}
                    <button class="action-btn delete" onclick="App.deleteExam('${exam.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    },

    showExamModal(id = null) {
        const exam = id ? this.data.exams.find(e => e.id === id) : null;
        const content = `
            <form id="examForm">
                <div class="form-group">
                    <label>Deneme Adı *</label>
                    <input type="text" name="name" value="${exam?.name || ''}" required placeholder="örn: 1. Deneme Sınavı">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tarih *</label>
                        <input type="date" name="date" value="${exam?.date || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Ders</label>
                        <input type="text" name="subject" value="${exam?.subject || ''}" placeholder="örn: Matematik">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Süre (dk)</label>
                        <input type="number" name="duration" value="${exam?.duration || '40'}" min="1">
                    </div>
                    <div class="form-group">
                        <label>Yer</label>
                        <input type="text" name="location" value="${exam?.location || ''}" placeholder="örn: A101">
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="2">${exam?.description || ''}</textarea>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Güncelle' : 'Kaydet', class: 'btn-primary', action: `App.saveExam('${id || ''}')` }
        ];
        this.showModal(id ? 'Deneme Düzenle' : 'Yeni Deneme', content, buttons);
    },

    saveExam(id) {
        const form = document.getElementById('examForm');
        const formData = new FormData(form);
        const examData = {
            name: formData.get('name'),
            date: formData.get('date'),
            subject: formData.get('subject'),
            duration: formData.get('duration'),
            location: formData.get('location'),
            description: formData.get('description')
        };

        if (id) {
            const index = this.data.exams.findIndex(e => e.id === id);
            this.data.exams[index] = { ...this.data.exams[index], ...examData };
        } else {
            this.data.exams.push({ id: this.generateId(), ...examData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Deneme güncellendi!' : 'Deneme eklendi!');
    },

    deleteExam(id) {
        if (confirm('Bu denemeyi silmek istediğinize emin misiniz?')) {
            this.data.exams = this.data.exams.filter(e => e.id !== id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Deneme silindi!');
        }
    },

    renderAttendance() {
        return `
            <div class="page-header">
                <h1 class="page-title">Devamsızlık Takibi</h1>
                <button class="btn btn-primary" onclick="App.showAttendanceModal()">
                    <i class="fas fa-plus"></i> Yoklama Ekle
                </button>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Öğrenci Devamsızlık Özeti</span>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Öğrenci</th>
                                <th>Devamsız (Gün)</th>
                                <th>Devamsız (Saat)</th>
                                <th>İzinli (Gün)</th>
                                <th>Detay</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderAttendanceSummary()}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Tüm Yoklama Kayıtları</span>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tarih</th>
                                <th>Öğrenci</th>
                                <th>Durum</th>
                                <th>Açıklama</th>
                                <th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderAttendanceTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderAttendanceSummary() {
        if (this.data.students.length === 0) {
            return '<tr><td colspan="5" style="text-align: center; padding: 30px;">Öğrenci bulunamadı</td></tr>';
        }
        return this.data.students.map(s => {
            const studentAttendance = this.data.attendance.filter(a => a.studentId === s.id);
            const absentDays = studentAttendance.filter(a => a.status === 'absent').length;
            const lateDays = studentAttendance.filter(a => a.status === 'late').length;
            return `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="student-avatar" style="width: 35px; height: 35px; font-size: 14px;">${s.name.charAt(0)}</div>
                            ${s.name}
                        </div>
                    </td>
                    <td><span class="badge badge-danger">${absentDays}</span></td>
                    <td><span class="badge badge-warning">${lateDays}</span></td>
                    <td>0</td>
                    <td>
                        <button class="action-btn view" onclick="App.viewStudentAttendance('${s.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderAttendanceTable() {
        const sorted = [...this.data.attendance].sort((a, b) => new Date(b.date) - new Date(a.date));
        if (sorted.length === 0) {
            return '<tr><td colspan="5" style="text-align: center; padding: 30px;">Henüz yoklama kaydı eklenmedi</td></tr>';
        }
        return sorted.map(a => {
            const student = this.data.students.find(s => s.id === a.studentId);
            const statusClass = a.status === 'present' ? 'badge-success' : a.status === 'absent' ? 'badge-danger' : 'badge-warning';
            const statusText = a.status === 'present' ? 'Var' : a.status === 'absent' ? 'Yok' : 'Geç';
            return `
                <tr>
                    <td>${a.date}</td>
                    <td>${student?.name || '-'}</td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                    <td>${a.note || '-'}</td>
                    <td>
                        <button class="action-btn delete" onclick="App.deleteAttendance('${a.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showAttendanceModal() {
        const content = `
            <form id="attendanceForm">
                <div class="form-group">
                    <label>Öğrenci *</label>
                    <select name="studentId" required>
                        <option value="">Seçin...</option>
                        ${this.data.students.map(s => `<option value="${s.id}">${s.name} (${s.number})</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tarih *</label>
                        <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label>Durum *</label>
                        <select name="status" required>
                            <option value="present">Var</option>
                            <option value="absent">Yok</option>
                            <option value="late">Geç</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="note" rows="2" placeholder="Varsa not..."></textarea>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: 'App.saveAttendance()' }
        ];
        this.showModal('Yoklama Ekle', content, buttons);
    },

    saveAttendance() {
        const form = document.getElementById('attendanceForm');
        const formData = new FormData(form);
        const attendanceData = {
            studentId: formData.get('studentId'),
            date: formData.get('date'),
            status: formData.get('status'),
            note: formData.get('note')
        };

        this.data.attendance.push({ id: this.generateId(), ...attendanceData });
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Yoklama kaydı eklendi!');
    },

    deleteAttendance(id) {
        if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
            this.data.attendance = this.data.attendance.filter(a => a.id !== id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Kayıt silindi!');
        }
    },

    viewStudentAttendance(studentId) {
        const student = this.data.students.find(s => s.id === studentId);
        const attendance = this.data.attendance.filter(a => a.studentId === studentId);
        
        const content = `
            <h4 style="margin-bottom: 15px;">${student.name} - Devamsızlık Detayı</h4>
            <div class="attendance-grid" style="margin-bottom: 20px;">
                ${attendance.map(a => {
                    const cls = a.status === 'present' ? 'present' : a.status === 'absent' ? 'absent' : 'late';
                    const label = a.status === 'present' ? '✓' : a.status === 'absent' ? '✗' : '●';
                    return `<div class="attendance-day ${cls}" title="${a.date}: ${a.status}">${a.date.split('-')[2]}</div>`;
                }).join('')}
            </div>
            <table style="width: 100%; font-size: 13px;">
                ${attendance.map(a => {
                    const statusClass = a.status === 'present' ? 'badge-success' : a.status === 'absent' ? 'badge-danger' : 'badge-warning';
                    const statusText = a.status === 'present' ? 'Var' : a.status === 'absent' ? 'Yok' : 'Geç';
                    return `<tr>
                        <td style="padding: 8px;">${a.date}</td>
                        <td><span class="badge ${statusClass}">${statusText}</span></td>
                        <td>${a.note || '-'}</td>
                    </tr>`;
                }).join('')}
            </table>
        `;
        this.showModal('Devamsızlık Detayı', content, [
            { text: 'Kapat', action: 'App.closeModal()' }
        ]);
    },

    renderTeachers() {
        return `
            <div class="page-header">
                <h1 class="page-title">Öğretmenler</h1>
                <button class="btn btn-primary" onclick="App.showTeacherModal()">
                    <i class="fas fa-plus"></i> Öğretmen Ekle
                </button>
            </div>

            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ad Soyad</th>
                                <th>Brans</th>
                                <th>Telefon</th>
                                <th>E-posta</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderTeachersTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderTeachersTable() {
        if (this.data.teachers.length === 0) {
            return '<tr><td colspan="5" style="text-align: center; padding: 30px;">Henüz öğretmen eklenmedi</td></tr>';
        }
        return this.data.teachers.map(t => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="student-avatar" style="background: var(--secondary);">${t.name.charAt(0)}</div>
                        ${t.name}
                    </div>
                </td>
                <td>${t.branch || '-'}</td>
                <td>${t.phone || '-'}</td>
                <td>${t.email || '-'}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="App.showTeacherModal('${t.id}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="App.deleteTeacher('${t.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showTeacherModal(id = null) {
        const teacher = id ? this.data.teachers.find(t => t.id === id) : null;
        const branches = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İngilizce', 'Almanca', 'Din Kültürü', 'Müzik', 'Görsel Sanatlar', 'Beden Eğitimi', 'Teknoloji', 'Resim'];
        
        const content = `
            <form id="teacherForm">
                <div class="form-group">
                    <label>Ad Soyad *</label>
                    <input type="text" name="name" value="${teacher?.name || ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Branş</label>
                        <select name="branch">
                            <option value="">Seçin...</option>
                            ${branches.map(b => `<option value="${b}" ${teacher?.branch === b ? 'selected' : ''}>${b}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Telefon</label>
                        <input type="tel" name="phone" value="${teacher?.phone || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>E-posta</label>
                    <input type="email" name="email" value="${teacher?.email || ''}">
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Güncelle' : 'Kaydet', class: 'btn-primary', action: `App.saveTeacher('${id || ''}')` }
        ];
        this.showModal(id ? 'Öğretmen Düzenle' : 'Yeni Öğretmen', content, buttons);
    },

    saveTeacher(id) {
        const form = document.getElementById('teacherForm');
        const formData = new FormData(form);
        const teacherData = {
            name: formData.get('name'),
            branch: formData.get('branch'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };

        if (id) {
            const index = this.data.teachers.findIndex(t => t.id === id);
            this.data.teachers[index] = { ...this.data.teachers[index], ...teacherData };
        } else {
            this.data.teachers.push({ id: this.generateId(), ...teacherData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Öğretmen güncellendi!' : 'Öğretmen eklendi!');
    },

    deleteTeacher(id) {
        if (confirm('Bu öğretmeni silmek istediğinize emin misiniz?')) {
            this.data.teachers = this.data.teachers.filter(t => t.id !== id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Öğretmen silindi!');
        }
    },

    renderSettings() {
        return `
            <div class="page-header">
                <h1 class="page-title">Ayarlar</h1>
            </div>

            <div class="card" style="max-width: 600px;">
                <div class="card-header">
                    <span class="card-title">Sınıf Bilgileri</span>
                </div>
                <form id="settingsForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Sınıf Adı</label>
                            <input type="text" name="className" value="${this.data.settings.className || ''}" placeholder="örn: 9-A">
                        </div>
                        <div class="form-group">
                            <label>Sınıf Seviyesi</label>
                            <select name="classLevel">
                                <option value="">Seçin...</option>
                                ${[9,10,11,12].map(l => `<option value="${l}" ${this.data.settings.classLevel == l ? 'selected' : ''}>${l}. Sınıf</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Dönem</label>
                            <select name="term">
                                <option value="">Seçin...</option>
                                <option value="1" ${this.data.settings.term === '1' ? 'selected' : ''}>1. Dönem</option>
                                <option value="2" ${this.data.settings.term === '2' ? 'selected' : ''}>2. Dönem</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Öğretim Yılı</label>
                            <input type="text" name="schoolYear" value="${this.data.settings.schoolYear || ''}" placeholder="örn: 2025-2026">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Kaydet</button>
                </form>
            </div>

            <div class="card" style="max-width: 600px; margin-top: 20px;">
                <div class="card-header">
                    <span class="card-title">Veri Yönetimi</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="App.exportData()">
                        <i class="fas fa-download"></i> Verileri Dışa Aktar
                    </button>
                    <button class="btn btn-danger" onclick="App.clearAllData()">
                        <i class="fas fa-trash"></i> Tüm Verileri Sil
                    </button>
                </div>
            </div>
        `;
    },

    attachPageListeners(page) {
        if (page === 'settings') {
            document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                this.data.settings = {
                    className: formData.get('className'),
                    classLevel: formData.get('classLevel'),
                    term: formData.get('term'),
                    schoolYear: formData.get('schoolYear')
                };
                this.saveData();
                this.updateClassInfo();
                this.showToast('Ayarlar kaydedildi!');
            });
        }
    },

    clearAllData() {
        if (confirm('TÜM verileri silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
            localStorage.removeItem('schoolData');
            this.data = {
                settings: { className: '', classLevel: '', term: '', schoolYear: '' },
                students: [], teachers: [], subjects: [], grades: [], schedule: [], exams: [], attendance: []
            };
            this.updateClassInfo();
            this.renderPage(this.currentPage);
            this.showToast('Tüm veriler silindi!');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
