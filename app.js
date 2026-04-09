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
        attendance: [],
        announcements: [],
        assignments: [],
        clubs: [],
        library: [],
        badges: [],
        starPoints: [],
        moods: [],
        goals: [],
        rewards: [],
        trialExams: [],
        trialResults: [],
        messages: [],
        files: [],
        notifications: []
    },
    currentUser: null,
    currentPage: 'dashboard',

    init() {
        this.checkAuth();
        this.initDarkMode();
    },

    initDarkMode() {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            this.updateDarkModeToggle();
        }
    },

    toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        this.updateDarkModeToggle();
    },

    updateDarkModeToggle() {
        const isDark = document.body.classList.contains('dark-mode');
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.innerHTML = isDark 
                ? '<i class="fas fa-sun"></i><span>Aydınlık</span>'
                : '<i class="fas fa-moon"></i><span>Karanlık</span>';
        }
    },

    checkAuth() {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) {
            window.location.href = 'index.html';
            return;
        }
        this.currentUser = JSON.parse(userStr);
        this.loadData();
        this.setupEventListeners();
        this.updateClassInfo();
        this.updateUserInfo();
        this.renderNavMenu();
        this.navigate('dashboard');
    },

    loadData() {
        const defaultData = {
            settings: { className: '', classLevel: '', term: '', schoolYear: '' },
            students: [], teachers: [], subjects: [], grades: [], schedule: [], exams: [], attendance: [],
            announcements: [], assignments: [], clubs: [], library: [],
            badges: [], starPoints: [], moods: [], goals: [], rewards: []
        };
        
        const saved = localStorage.getItem('schoolData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.data = { ...defaultData, ...parsed };
                if (!this.data.announcements) this.data.announcements = [];
                if (!this.data.assignments) this.data.assignments = [];
                if (!this.data.clubs) this.data.clubs = [];
                if (!this.data.library) this.data.library = [];
                if (!this.data.badges) this.data.badges = [];
                if (!this.data.starPoints) this.data.starPoints = [];
                if (!this.data.moods) this.data.moods = [];
                if (!this.data.goals) this.data.goals = [];
                if (!this.data.rewards) this.data.rewards = [];
            if (!this.data.trialExams) this.data.trialExams = [];
            if (!this.data.trialResults) this.data.trialResults = [];
            if (!this.data.messages) this.data.messages = [];
            if (!this.data.files) this.data.files = [];
            if (!this.data.notifications) this.data.notifications = [];
            } catch(e) {
                this.data = defaultData;
            }
        } else {
            this.data = defaultData;
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

    updateUserInfo() {
        document.getElementById('userAvatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userRole').textContent = this.getRoleName(this.currentUser.role);
    },

    getRoleName(role) {
        const names = {
            admin: 'Yönetici',
            teacher: 'Öğretmen',
            student: 'Öğrenci',
            parent: 'Veli'
        };
        return names[role] || role;
    },

    renderNavMenu() {
        const nav = document.getElementById('navMenu');
        if (!nav) return;
        
        const role = this.currentUser ? this.currentUser.role : 'admin';
        let menuItems = [];

        if (role === 'admin') {
            menuItems = [
                { page: 'dashboard', icon: 'fa-home', label: 'Ana Panel' },
                { page: 'announcements', icon: 'fa-bullhorn', label: 'Duyurular' },
                { page: 'users', icon: 'fa-users-cog', label: 'Kullanıcılar' },
                { page: 'students', icon: 'fa-user-graduate', label: 'Öğrenciler' },
                { page: 'teachers', icon: 'fa-chalkboard-teacher', label: 'Öğretmenler' },
                { page: 'grades', icon: 'fa-chart-line', label: 'Notlar' },
                { page: 'gradeanalysis', icon: 'fa-chart-bar', label: 'Not Analizi' },
                { page: 'assignments', icon: 'fa-tasks', label: 'Ödevler' },
                { page: 'schedule', icon: 'fa-calendar-week', label: 'Ders Programı' },
                { page: 'exams', icon: 'fa-file-alt', label: 'Deneme Çizelgesi' },
                { page: 'trialresults', icon: 'fa-chart-bar', label: 'Deneme Sonuçları' },
                { page: 'attendance', icon: 'fa-clipboard-list', label: 'Devamsızlık' },
                { page: 'clubs', icon: 'fa-users', label: 'Kulüpler' },
                { page: 'library', icon: 'fa-book', label: 'Kütüphane' },
                { page: 'badges', icon: 'fa-award', label: 'Rozetler' },
                { page: 'leaderboard', icon: 'fa-trophy', label: 'Liderlik' },
                { page: 'messages', icon: 'fa-comments', label: 'Mesajlar' },
                { page: 'files', icon: 'fa-folder', label: 'Dosyalar' },
                { page: 'notifications', icon: 'fa-bell', label: 'Bildirimler' },
                { page: 'report', icon: 'fa-file-pdf', label: 'Karne/Rapor' },
                { page: 'stars', icon: 'fa-star', label: 'Yıldız Puanı' },
                { page: 'goals', icon: 'fa-bullseye', label: 'Hedefler' },
                { page: 'rewards', icon: 'fa-gift', label: 'Ödüller' },
                { page: 'settings', icon: 'fa-cog', label: 'Ayarlar' }
            ];
        } else if (role === 'teacher') {
            menuItems = [
                { page: 'dashboard', icon: 'fa-home', label: 'Ana Panel' },
                { page: 'announcements', icon: 'fa-bullhorn', label: 'Duyurular' },
                { page: 'grades', icon: 'fa-chart-line', label: 'Not Girişi' },
                { page: 'assignments', icon: 'fa-tasks', label: 'Ödevler' },
                { page: 'schedule', icon: 'fa-calendar-week', label: 'Ders Programı' },
                { page: 'attendance', icon: 'fa-clipboard-list', label: 'Yoklama' },
                { page: 'students', icon: 'fa-user-graduate', label: 'Öğrenciler' },
                { page: 'trialresults', icon: 'fa-chart-bar', label: 'Deneme Sonuçları' },
                { page: 'clubs', icon: 'fa-users', label: 'Kulüpler' },
                { page: 'stars', icon: 'fa-star', label: 'Yıldız Ver' },
                { page: 'badges', icon: 'fa-award', label: 'Rozet Ver' },
                { page: 'goals', icon: 'fa-bullseye', label: 'Hedefler' },
                { page: 'messages', icon: 'fa-comments', label: 'Mesajlar' },
                { page: 'files', icon: 'fa-folder', label: 'Dosyalar' },
                { page: 'report', icon: 'fa-file-pdf', label: 'Karne/Rapor' }
            ];
        } else if (role === 'student') {
            menuItems = [
                { page: 'dashboard', icon: 'fa-home', label: 'Ana Panel' },
                { page: 'announcements', icon: 'fa-bullhorn', label: 'Duyurular' },
                { page: 'mood', icon: 'fa-smile', label: 'Bugün Nasılım?' },
                { page: 'mygrades', icon: 'fa-chart-line', label: 'Notlarım' },
                { page: 'gradeanalysis', icon: 'fa-chart-bar', label: 'Gelişimim' },
                { page: 'lgsanalysis', icon: 'fa-graduation-cap', label: 'LGS Analiz' },
                { page: 'myassignments', icon: 'fa-tasks', label: 'Ödevlerim' },
                { page: 'myschedule', icon: 'fa-calendar-week', label: 'Ders Programım' },
                { page: 'myattendance', icon: 'fa-clipboard-list', label: 'Devamsızlığım' },
                { page: 'myexams', icon: 'fa-file-alt', label: 'Deneme Takvimi' },
                { page: 'mytrialresults', icon: 'fa-chart-bar', label: 'Deneme Sonuçlarım' },
                { page: 'clubs', icon: 'fa-users', label: 'Kulüpler' },
                { page: 'library', icon: 'fa-book', label: 'Kütüphane' },
                { page: 'messages', icon: 'fa-comments', label: 'Mesajlar' },
                { page: 'myfiles', icon: 'fa-folder', label: 'Dosyalarım' },
                { page: 'mybadges', icon: 'fa-award', label: 'Rozetlerim' },
                { page: 'mystars', icon: 'fa-star', label: 'Yıldızlarım' },
                { page: 'mygoals', icon: 'fa-bullseye', label: 'Hedeflerim' },
                { page: 'leaderboard', icon: 'fa-trophy', label: 'Liderlik' },
                { page: 'rewards', icon: 'fa-gift', label: 'Ödüller' }
            ];
        } else if (role === 'parent') {
            menuItems = [
                { page: 'dashboard', icon: 'fa-home', label: 'Ana Panel' },
                { page: 'childgrades', icon: 'fa-chart-line', label: 'Notları' },
                { page: 'childattendance', icon: 'fa-clipboard-list', label: 'Devamsızlığı' },
                { page: 'childmood', icon: 'fa-smile', label: 'Ruh Hali' },
                { page: 'schedule', icon: 'fa-calendar-week', label: 'Ders Programı' },
                { page: 'messages', icon: 'fa-comments', label: 'Mesajlar' },
                { page: 'parentreport', icon: 'fa-file-pdf', label: 'Veli Raporu' }
            ];
        }

        let html = '';
        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            const activeClass = this.currentPage === item.page ? ' active' : '';
            html += '<a href="#" class="nav-item' + activeClass + '" data-page="' + item.page + '"><i class="fas ' + item.icon + '"></i><span>' + item.label + '</span></a>';
        }
        nav.innerHTML = html;
        
        const self = this;
        const items = nav.querySelectorAll('.nav-item');
        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                self.navigate(page);
            });
        }
    },

    setupEventListeners() {
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        document.getElementById('importData').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importData(e));
    },

    navigate(page) {
        this.currentPage = page;
        const nav = document.getElementById('navMenu');
        if (nav) {
            const items = nav.querySelectorAll('.nav-item');
            for (let i = 0; i < items.length; i++) {
                items[i].classList.remove('active');
                if (items[i].getAttribute('data-page') === page) {
                    items[i].classList.add('active');
                }
            }
        }
        this.renderPage(page);
    },

    renderPage(page) {
        const content = document.getElementById('pageContent');
        if (!content) return;
        
        const pages = {
            dashboard: () => this.renderDashboard(),
            users: () => this.renderUsers(),
            students: () => this.renderStudents(),
            teachers: () => this.renderTeachers(),
            grades: () => this.renderGrades(),
            gradeanalysis: () => this.renderGradeAnalysis(),
            schedule: () => this.renderSchedule(),
            exams: () => this.renderExams(),
            trialresults: () => this.renderTrialResults(),
            mytrialresults: () => this.renderMyTrialResults(),
            attendance: () => this.renderAttendance(),
            settings: () => this.renderSettings(),
            announcements: () => this.renderAnnouncements(),
            assignments: () => this.renderAssignments(),
            myassignments: () => this.renderMyAssignments(),
            clubs: () => this.renderClubs(),
            library: () => this.renderLibrary(),
            mygrades: () => this.renderMyGrades(),
            myschedule: () => this.renderMySchedule(),
            myattendance: () => this.renderMyAttendance(),
            myexams: () => this.renderMyExams(),
            childgrades: () => this.renderChildGrades(),
            childattendance: () => this.renderChildAttendance(),
            badges: () => this.renderBadges(),
            mybadges: () => this.renderMyBadges(),
            leaderboard: () => this.renderLeaderboard(),
            stars: () => this.renderStars(),
            mystars: () => this.renderMyStars(),
            mood: () => this.renderMood(),
            childmood: () => this.renderChildMood(),
            goals: () => this.renderGoals(),
            mygoals: () => this.renderMyGoals(),
            lgsanalysis: () => this.renderLGSAnalysis(),
            rewards: () => this.renderRewards(),
            messages: () => this.renderMessages(),
            mymessages: () => this.renderMyMessages(),
            files: () => this.renderFiles(),
            myfiles: () => this.renderMyFiles(),
            notifications: () => this.renderNotifications(),
            report: () => this.renderReport(),
            parentreport: () => this.renderParentReport()
        };

        const renderFn = pages[page];
        if (renderFn) {
            try {
                content.innerHTML = renderFn();
                this.attachPageListeners(page);
            } catch(e) {
                content.innerHTML = '<p style="color: red;">Sayfa yüklenirken hata: ' + e.message + '</p>';
                console.error(e);
            }
        } else {
            content.innerHTML = '<p style="padding: 20px;">Sayfa bulunamadı: ' + page + '</p>';
        }
    },

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
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
        if (!query || this.currentUser.role === 'student' || this.currentUser.role === 'parent') return;
    },

    renderDashboard() {
        const role = this.currentUser.role;
        
        if (role === 'admin') {
            return this.renderAdminDashboard();
        } else if (role === 'teacher') {
            return this.renderTeacherDashboard();
        } else if (role === 'student') {
            return this.renderStudentDashboard();
        } else if (role === 'parent') {
            return this.renderParentDashboard();
        }
    },

    renderAdminDashboard() {
        const totalStudents = this.data.students.length;
        const totalTeachers = this.data.teachers.length;
        const users = JSON.parse(localStorage.getItem('schoolUsers') || '{"users":[]}').users || [];
        const upcomingExams = this.data.exams.filter(e => new Date(e.date) >= new Date()).length;
        const avgGrade = this.data.grades.length > 0 
            ? (this.data.grades.reduce((a, g) => a + (parseFloat(g.score) || 0), 0) / this.data.grades.length).toFixed(1)
            : '-';

        return `
            <div class="page-header">
                <h1 class="page-title">Admin Ana Panel</h1>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-users"></i></div>
                    <div class="stat-info">
                        <h4>${users.length}</h4>
                        <p>Toplam Kullanıcı</p>
                    </div>
                </div>
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
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Son Eklenen Öğrenciler</span>
                    </div>
                    ${this.renderRecentStudents()}
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Son Eklenen Öğretmenler</span>
                    </div>
                    ${this.renderRecentTeachers()}
                </div>
            </div>
        `;
    },

    renderTeacherDashboard() {
        const myGrades = this.data.grades.length;
        const mySchedule = this.data.schedule.length;
        const upcomingExams = this.data.exams.filter(e => new Date(e.date) >= new Date()).length;

        return `
            <div class="page-header">
                <h1 class="page-title">Öğretmen Ana Panel</h1>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info">
                        <h4>${myGrades}</h4>
                        <p>Girilen Not</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-calendar-week"></i></div>
                    <div class="stat-info">
                        <h4>${mySchedule}</h4>
                        <p>Ders Saati</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-file-alt"></i></div>
                    <div class="stat-info">
                        <h4>${upcomingExams}</h4>
                        <p>Yaklaşan Deneme</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Hızlı İşlemler</span>
                </div>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="App.navigate('grades')">
                        <i class="fas fa-plus"></i> Not Girişi Yap
                    </button>
                    <button class="btn btn-secondary" onclick="App.navigate('attendance')">
                        <i class="fas fa-clipboard-list"></i> Yoklama Al
                    </button>
                    <button class="btn btn-secondary" onclick="App.navigate('students')">
                        <i class="fas fa-user-graduate"></i> Öğrencileri Gör
                    </button>
                </div>
            </div>
        `;
    },

    renderStudentDashboard() {
        const studentId = this.currentUser.studentId;
        const myGrades = studentId ? this.data.grades.filter(g => g.studentId === studentId) : [];
        const myAttendance = studentId ? this.data.attendance.filter(a => a.studentId === studentId) : [];
        
        const avgGrade = myGrades.length > 0 
            ? (myGrades.reduce((a, g) => a + parseFloat(g.score), 0) / myGrades.length).toFixed(1)
            : '-';
        
        const presentDays = myAttendance.filter(a => a.status === 'present').length;
        const absentDays = myAttendance.filter(a => a.status === 'absent').length;

        return `
            <div class="page-header">
                <h1 class="page-title">Hoş Geldin, ${this.currentUser.name}!</h1>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info">
                        <h4>${avgGrade}</h4>
                        <p>Ortalamam</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <h4>${presentDays}</h4>
                        <p>Devamsız Gün</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-times-circle"></i></div>
                    <div class="stat-info">
                        <h4>${absentDays}</h4>
                        <p>Devamsız Gün</p>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Son Notlarım</span>
                    </div>
                    ${myGrades.length > 0 ? myGrades.slice(-5).reverse().map(g => `
                        <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                            <span>${g.subject}</span>
                            <span class="badge ${parseFloat(g.score) >= 50 ? 'badge-success' : 'badge-danger'}">${g.score}</span>
                        </div>
                    `).join('') : '<p style="text-align: center; color: var(--gray-500); padding: 20px;">Henüz not girilmedi</p>'}
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Yaklaşan Denemeler</span>
                    </div>
                    ${this.renderUpcomingExams()}
                </div>
            </div>
        `;
    },

    renderParentDashboard() {
        const studentId = this.currentUser.studentId;
        const student = this.data.students.find(s => s.id === studentId);
        const myGrades = studentId ? this.data.grades.filter(g => g.studentId === studentId) : [];
        const myAttendance = studentId ? this.data.attendance.filter(a => a.studentId === studentId) : [];
        
        const avgGrade = myGrades.length > 0 
            ? (myGrades.reduce((a, g) => a + parseFloat(g.score), 0) / myGrades.length).toFixed(1)
            : '-';
        
        const absentDays = myAttendance.filter(a => a.status === 'absent').length;

        return `
            <div class="page-header">
                <h1 class="page-title">Hoş Geldiniz!</h1>
            </div>

            ${student ? `
                <div class="card" style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div class="student-avatar" style="width: 60px; height: 60px; font-size: 24px;">${student.name.charAt(0)}</div>
                        <div>
                            <h3>${student.name}</h3>
                            <p style="color: var(--gray-500);">Öğrenci No: ${student.number}</p>
                        </div>
                    </div>
                </div>
            ` : '<p style="color: var(--gray-500);">Öğrenci bilgisi bulunamadı</p>'}

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info">
                        <h4>${avgGrade}</h4>
                        <p>Ortalama</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-times-circle"></i></div>
                    <div class="stat-info">
                        <h4>${absentDays}</h4>
                        <p>Devamsız Gün</p>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Son Notlar</span>
                    </div>
                    ${myGrades.length > 0 ? myGrades.slice(-5).reverse().map(g => `
                        <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                            <span>${g.subject}</span>
                            <span class="badge ${parseFloat(g.score) >= 50 ? 'badge-success' : 'badge-danger'}">${g.score}</span>
                        </div>
                    `).join('') : '<p style="text-align: center; color: var(--gray-500); padding: 20px;">Henüz not girilmedi</p>'}
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Hızlı İşlemler</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="btn btn-secondary" onclick="App.navigate('childgrades')">
                            <i class="fas fa-chart-line"></i> Tüm Notları Gör
                        </button>
                        <button class="btn btn-secondary" onclick="App.navigate('childattendance')">
                            <i class="fas fa-clipboard-list"></i> Devamsızlık Detayı
                        </button>
                    </div>
                </div>
            </div>
        `;
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

    renderRecentTeachers() {
        const recent = this.data.teachers.slice(-5).reverse();
        if (recent.length === 0) {
            return '<p class="empty-state">Henüz öğretmen eklenmedi</p>';
        }
        return recent.map(teacher => `
            <div style="display: flex; align-items: center; gap: 15px; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                <div class="student-avatar" style="background: var(--secondary);">${teacher.name.charAt(0)}</div>
                <div>
                    <h4>${teacher.name}</h4>
                    <p style="font-size: 12px; color: var(--gray-500);">${teacher.branch || '-'}</p>
                </div>
            </div>
        `).join('');
    },

    renderUpcomingExams() {
        const upcoming = this.data.exams
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

        if (upcoming.length === 0) {
            return '<p class="empty-state">Yaklaşan deneme yok</p>';
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

    renderUsers() {
        const users = JSON.parse(localStorage.getItem('schoolUsers') || '{"users":[]}').users || [];
        
        return `
            <div class="page-header">
                <h1 class="page-title">Kullanıcı Yönetimi</h1>
                <button class="btn btn-primary" onclick="App.showUserModal()">
                    <i class="fas fa-plus"></i> Kullanıcı Ekle
                </button>
            </div>

            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Kullanıcı Adı</th>
                                <th>Ad Soyad</th>
                                <th>Rol</th>
                                <th>Bağlı Öğrenci</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderUsersTable(users)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderUsersTable(users) {
        if (users.length === 0) {
            return '<tr><td colspan="5" style="text-align: center; padding: 30px;">Kullanıcı bulunamadı</td></tr>';
        }
        return users.map(u => {
            let linkedStudent = '-';
            if (u.studentId) {
                const student = this.data.students.find(s => s.id === u.studentId);
                linkedStudent = student ? student.name : '<em>Silinen öğrenci</em>';
            }
            const roleBadge = {
                admin: 'badge-danger',
                teacher: 'badge-info',
                student: 'badge-success',
                parent: 'badge-warning'
            }[u.role] || 'badge-info';
            const roleText = this.getRoleName(u.role);
            
            return `
                <tr>
                    <td><strong>${u.username}</strong></td>
                    <td>${u.name}</td>
                    <td><span class="badge ${roleBadge}">${roleText}</span></td>
                    <td>${linkedStudent}</td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn edit" onclick="App.showUserModal('${u.id}')"><i class="fas fa-edit"></i></button>
                            ${u.username !== 'admin' ? `<button class="action-btn delete" onclick="App.deleteUser('${u.id}')"><i class="fas fa-trash"></i></button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    showUserModal(id = null) {
        const users = JSON.parse(localStorage.getItem('schoolUsers') || '{"users":[]}');
        const user = id ? users.users.find(u => u.id === id) : null;
        
        const content = `
            <form id="userForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Kullanıcı Adı *</label>
                        <input type="text" name="username" value="${user?.username || ''}" required ${id ? 'readonly' : ''} style="${id ? 'background: var(--gray-100);' : ''}">
                    </div>
                    <div class="form-group">
                        <label>Rol *</label>
                        <select name="role" required onchange="App.onRoleChange(this.value)">
                            <option value="">Seçin...</option>
                            <option value="admin" ${user?.role === 'admin' ? 'selected' : ''}>Admin</option>
                            <option value="teacher" ${user?.role === 'teacher' ? 'selected' : ''}>Öğretmen</option>
                            <option value="student" ${user?.role === 'student' ? 'selected' : ''}>Öğrenci</option>
                            <option value="parent" ${user?.role === 'parent' ? 'selected' : ''}>Veli</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Ad Soyad *</label>
                    <input type="text" name="name" value="${user?.name || ''}" required>
                </div>
                <div class="form-group" id="studentSelectGroup" style="display: none;">
                    <label>Bağlı Öğrenci</label>
                    <select name="studentId">
                        <option value="">Seçin...</option>
                        ${this.data.students.map(s => `<option value="${s.id}" ${user?.studentId === s.id ? 'selected' : ''}>${s.name} (${s.number})</option>`).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Şifre ${id ? '(değiştirmek için)' : '*'}</label>
                        <input type="password" name="password" ${!id ? 'required' : ''} placeholder="${id ? 'Değiştirmek istemiyorsanız boş bırakın' : ''}">
                    </div>
                </div>
            </form>
            <script>
                App.onRoleChange = function(role) {
                    const group = document.getElementById('studentSelectGroup');
                    group.style.display = (role === 'student' || role === 'parent') ? 'block' : 'none';
                };
                ${user && (user.role === 'student' || user.role === 'parent') ? 'document.getElementById("studentSelectGroup").style.display = "block";' : ''}
            </script>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Güncelle' : 'Kaydet', class: 'btn-primary', action: `App.saveUser('${id || ''}')` }
        ];
        this.showModal(id ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı', content, buttons);
    },

    onRoleChange(role) {},

    saveUser(id) {
        const form = document.getElementById('userForm');
        const formData = new FormData(form);
        
        let users = JSON.parse(localStorage.getItem('schoolUsers') || '{"users":[]}');
        if (!users.users) users.users = [];
        
        const userData = {
            username: formData.get('username'),
            name: formData.get('name'),
            role: formData.get('role'),
            studentId: formData.get('studentId') || null
        };

        if (!id) {
            userData.password = formData.get('password');
            userData.id = this.generateId();
            
            if (users.users.some(u => u.username === userData.username)) {
                this.showToast('Bu kullanıcı adı zaten var!', 'error');
                return;
            }
            users.users.push(userData);
        } else {
            const index = users.users.findIndex(u => u.id === id);
            if (formData.get('password')) {
                userData.password = formData.get('password');
            } else {
                userData.password = users.users[index].password;
            }
            users.users[index] = { ...users.users[index], ...userData };
        }

        localStorage.setItem('schoolUsers', JSON.stringify(users));
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Kullanıcı güncellendi!' : 'Kullanıcı eklendi!');
    },

    deleteUser(id) {
        if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
            let users = JSON.parse(localStorage.getItem('schoolUsers') || '{"users":[]}');
            users.users = users.users.filter(u => u.id !== id);
            localStorage.setItem('schoolUsers', JSON.stringify(users));
            this.renderPage(this.currentPage);
            this.showToast('Kullanıcı silindi!');
        }
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
                        <button class="action-btn view" onclick="App.viewStudent('${s.id}')"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="App.showStudentModal('${s.id}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="App.deleteStudent('${s.id}')"><i class="fas fa-trash"></i></button>
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
        const users = JSON.parse(localStorage.getItem('schoolUsers') || '{"users":[]}').users || [];
        const existingUser = student ? users.find(u => u.studentId === student.id && u.role === 'student') : null;
        
        const content = `
            <form id="studentForm">
                <div class="form-section-title"><i class="fas fa-user-graduate"></i> Öğrenci Bilgileri</div>
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
                
                <div class="form-section-title" style="margin-top: 20px;"><i class="fas fa-user-circle"></i> Giriş Hesabı</div>
                <div class="form-toggle">
                    <label class="toggle-label">
                        <input type="checkbox" id="createStudentAccount" onchange="App.toggleAccountFields('student', this.checked)">
                        <span>Öğrenci giriş hesabı oluştur</span>
                    </label>
                </div>
                <div id="studentAccountFields" style="display: none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Kullanıcı Adı *</label>
                            <input type="text" name="studentUsername" id="studentUsername" placeholder="ogrenci123">
                        </div>
                        <div class="form-group">
                            <label>Şifre *</label>
                            <input type="password" name="studentPassword" id="studentPassword" placeholder="Min. 6 karakter">
                        </div>
                    </div>
                    <div class="form-hint">
                        <i class="fas fa-info-circle"></i> Öğrenci bu bilgilerle sisteme giriş yapabilecek
                    </div>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Güncelle' : 'Kaydet', class: 'btn-primary', action: `App.saveStudent('${id || ''}')` }
        ];
        this.showModal(id ? 'Öğrenci Düzenle' : 'Yeni Öğrenci', content, buttons);
    },
    
    toggleAccountFields(type, checked) {
        const fields = document.getElementById(type + 'AccountFields');
        const username = document.getElementById(type + 'Username');
        const password = document.getElementById(type + 'Password');
        if (checked) {
            fields.style.display = 'block';
            username.required = true;
            password.required = true;
        } else {
            fields.style.display = 'none';
            username.required = false;
            password.required = false;
        }
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

        const createAccount = document.getElementById('createStudentAccount')?.checked;
        const username = formData.get('studentUsername');
        const password = formData.get('studentPassword');

        if (id) {
            const index = this.data.students.findIndex(s => s.id === id);
            this.data.students[index] = { ...this.data.students[index], ...studentData };
        } else {
            if (this.data.students.some(s => s.number === studentData.number)) {
                this.showToast('Bu öğrenci numarası zaten kullanılıyor!', 'error');
                return;
            }
        }

        let users = JSON.parse(localStorage.getItem('schoolUsers') || '{"users":[]}');
        if (!users.users) users.users = [];
        
        const existingUser = users.users.find(u => u.studentId === id && u.role === 'student');
        
        if (createAccount && username && password) {
            if (existingUser) {
                existingUser.username = username;
                existingUser.name = studentData.name;
                existingUser.password = password;
            } else {
                if (!users.users.some(u => u.username === username)) {
                    users.users.push({
                        id: this.generateId(),
                        username: username,
                        password: password,
                        name: studentData.name,
                        role: 'student',
                        studentId: id || this.data.students[this.data.students.length - 1]?.id
                    });
                } else {
                    this.showToast('Bu kullanıcı adı zaten kullanılıyor!', 'error');
                    return;
                }
            }
            localStorage.setItem('schoolUsers', JSON.stringify(users));
        } else if (existingUser && !createAccount) {
            users.users = users.users.filter(u => u.id !== existingUser.id);
            localStorage.setItem('schoolUsers', JSON.stringify(users));
        }

        if (!id) {
            const newStudentId = this.generateId();
            studentData.id = newStudentId;
            this.data.students.push(studentData);
            if (createAccount && username && password) {
                const lastUser = users.users[users.users.length - 1];
                if (lastUser) lastUser.studentId = newStudentId;
                localStorage.setItem('schoolUsers', JSON.stringify(users));
            }
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

    renderMyGrades() {
        const studentId = this.currentUser.studentId;
        const myGrades = studentId ? this.data.grades.filter(g => g.studentId === studentId) : [];
        
        const avgGrade = myGrades.length > 0 
            ? (myGrades.reduce((a, g) => a + parseFloat(g.score), 0) / myGrades.length).toFixed(1)
            : '-';

        const subjects = [...new Set(myGrades.map(g => g.subject))];
        
        return `
            <div class="page-header">
                <h1 class="page-title">Notlarım</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info">
                        <h4>${avgGrade}</h4>
                        <p>Genel Ortalama</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <h4>${myGrades.filter(g => parseFloat(g.score) >= 50).length}</h4>
                        <p>Geçilen Sınav</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Ders Bazlı Notlar</span>
                </div>
                ${subjects.map(subject => {
                    const subjectGrades = myGrades.filter(g => g.subject === subject);
                    const avg = (subjectGrades.reduce((a, g) => a + parseFloat(g.score), 0) / subjectGrades.length).toFixed(1);
                    return `
                        <div style="margin-bottom: 15px; padding: 15px; background: var(--gray-100); border-radius: var(--radius);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <strong>${subject}</strong>
                                <span class="badge ${parseFloat(avg) >= 50 ? 'badge-success' : 'badge-danger'}">Ortalama: ${avg}</span>
                            </div>
                            ${subjectGrades.sort((a, b) => new Date(b.date) - new Date(a.date)).map(g => `
                                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid var(--gray-200);">
                                    <span>${g.examType} - ${g.date}</span>
                                    <span class="badge ${parseFloat(g.score) >= 50 ? 'badge-success' : 'badge-danger'}">${g.score}</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }).join('')}
                ${subjects.length === 0 ? '<p class="empty-state">Henüz not girilmedi</p>' : ''}
            </div>
        `;
    },

    renderSchedule() {
        const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
        const timeSlots = ['08:00-08:40', '08:50-09:30', '09:40-10:20', '10:30-11:10', '11:20-12:00', '13:00-13:40', '13:50-14:30', '14:40-15:20'];

        return `
            <div class="page-header">
                <h1 class="page-title">Ders Programı</h1>
                ${this.currentUser.role === 'admin' ? `
                    <button class="btn btn-primary" onclick="App.showScheduleModal()">
                        <i class="fas fa-plus"></i> Ders Ekle
                    </button>
                ` : ''}
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

    renderMySchedule() {
        return this.renderSchedule();
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
                ${this.currentUser.role === 'admin' ? `
                    <button class="btn btn-primary" onclick="App.showExamModal()">
                        <i class="fas fa-plus"></i> Deneme Ekle
                    </button>
                ` : ''}
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

    renderMyExams() {
        return this.renderExams();
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
                        <p>${exam.subject || 'Genel'} - ${exam.duration || '-'} dk - ${exam.location || '-'}</p>
                    </div>
                </div>
                ${this.currentUser.role === 'admin' ? `
                    <div class="action-btns">
                        ${!isPast ? `<button class="action-btn edit" onclick="App.showExamModal('${exam.id}')"><i class="fas fa-edit"></i></button>` : ''}
                        <button class="action-btn delete" onclick="App.deleteExam('${exam.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                ` : ''}
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
                ${this.currentUser.role !== 'student' && this.currentUser.role !== 'parent' ? `
                    <button class="btn btn-primary" onclick="App.showAttendanceModal()">
                        <i class="fas fa-plus"></i> Yoklama Ekle
                    </button>
                ` : ''}
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
                                <th>Geç (Gün)</th>
                                <th>Detay</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.renderAttendanceSummary()}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderMyAttendance() {
        const studentId = this.currentUser.studentId;
        const myAttendance = studentId ? this.data.attendance.filter(a => a.studentId === studentId) : [];
        const absentDays = myAttendance.filter(a => a.status === 'absent').length;
        const lateDays = myAttendance.filter(a => a.status === 'late').length;

        return `
            <div class="page-header">
                <h1 class="page-title">Devamsızlığım</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-times-circle"></i></div>
                    <div class="stat-info">
                        <h4>${absentDays}</h4>
                        <p>Devamsız Gün</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
                    <div class="stat-info">
                        <h4>${lateDays}</h4>
                        <p>Geç Kaldığım Gün</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Tüm Yoklama Kayıtlarım</span>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tarih</th>
                                <th>Durum</th>
                                <th>Açıklama</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myAttendance.sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => {
                                const statusClass = a.status === 'present' ? 'badge-success' : a.status === 'absent' ? 'badge-danger' : 'badge-warning';
                                const statusText = a.status === 'present' ? 'Var' : a.status === 'absent' ? 'Yok' : 'Geç';
                                return `
                                    <tr>
                                        <td>${a.date}</td>
                                        <td><span class="badge ${statusClass}">${statusText}</span></td>
                                        <td>${a.note || '-'}</td>
                                    </tr>
                                `;
                            }).join('')}
                            ${myAttendance.length === 0 ? '<tr><td colspan="3" style="text-align: center; padding: 30px;">Henüz yoklama kaydı yok</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderChildAttendance() {
        return this.renderMyAttendance();
    },

    renderAttendanceSummary() {
        if (this.data.students.length === 0) {
            return '<tr><td colspan="4" style="text-align: center; padding: 30px;">Öğrenci bulunamadı</td></tr>';
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
                    <td>
                        <button class="action-btn view" onclick="App.viewStudentAttendance('${s.id}')">
                            <i class="fas fa-eye"></i>
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

    viewStudentAttendance(studentId) {
        const student = this.data.students.find(s => s.id === studentId);
        const attendance = this.data.attendance.filter(a => a.studentId === studentId);
        
        const content = `
            <h4 style="margin-bottom: 15px;">${student.name} - Devamsızlık Detayı</h4>
            <table style="width: 100%; font-size: 13px;">
                ${attendance.sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => {
                    const statusClass = a.status === 'present' ? 'badge-success' : a.status === 'absent' ? 'badge-danger' : 'badge-warning';
                    const statusText = a.status === 'present' ? 'Var' : a.status === 'absent' ? 'Yok' : 'Geç';
                    return `<tr>
                        <td style="padding: 8px;">${a.date}</td>
                        <td><span class="badge ${statusClass}">${statusText}</span></td>
                        <td>${a.note || '-'}</td>
                    </tr>`;
                }).join('')}
                ${attendance.length === 0 ? '<tr><td colspan="3" style="text-align: center; padding: 20px;">Kayıt yok</td></tr>' : ''}
            </table>
        `;
        this.showModal('Devamsızlık Detayı', content, [
            { text: 'Kapat', action: 'App.closeModal()' }
        ]);
    },

    renderChildGrades() {
        return this.renderMyGrades();
    },

    renderTeachers() {
        return `
            <div class="page-header">
                <h1 class="page-title">Öğretmenler</h1>
                ${this.currentUser.role === 'admin' ? `
                    <button class="btn btn-primary" onclick="App.showTeacherModal()">
                        <i class="fas fa-plus"></i> Öğretmen Ekle
                    </button>
                ` : ''}
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
                                ${this.currentUser.role === 'admin' ? '<th>İşlemler</th>' : ''}
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
                ${this.currentUser.role === 'admin' ? `
                    <td>
                        <div class="action-btns">
                            <button class="action-btn edit" onclick="App.showTeacherModal('${t.id}')"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete" onclick="App.deleteTeacher('${t.id}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                ` : ''}
            </tr>
        `).join('');
    },

    showTeacherModal(id = null) {
        const teacher = id ? this.data.teachers.find(t => t.id === id) : null;
        const branches = ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İngilizce', 'Almanca', 'Din Kültürü', 'Müzik', 'Görsel Sanatlar', 'Beden Eğitimi', 'Teknoloji', 'Resim'];
        
        const content = `
            <form id="teacherForm">
                <div class="form-section-title"><i class="fas fa-chalkboard-teacher"></i> Öğretmen Bilgileri</div>
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
                
                <div class="form-section-title" style="margin-top: 20px;"><i class="fas fa-user-circle"></i> Giriş Hesabı</div>
                <div class="form-toggle">
                    <label class="toggle-label">
                        <input type="checkbox" id="createTeacherAccount" onchange="App.toggleAccountFields('teacher', this.checked)">
                        <span>Öğretmen giriş hesabı oluştur</span>
                    </label>
                </div>
                <div id="teacherAccountFields" style="display: none;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Kullanıcı Adı *</label>
                            <input type="text" name="teacherUsername" id="teacherUsername" placeholder="ogretmen123">
                        </div>
                        <div class="form-group">
                            <label>Şifre *</label>
                            <input type="password" name="teacherPassword" id="teacherPassword" placeholder="Min. 6 karakter">
                        </div>
                    </div>
                    <div class="form-hint">
                        <i class="fas fa-info-circle"></i> Öğretmen bu bilgilerle sisteme giriş yapabilecek
                    </div>
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

        const createAccount = document.getElementById('createTeacherAccount')?.checked;
        const username = formData.get('teacherUsername');
        const password = formData.get('teacherPassword');

        if (id) {
            const index = this.data.teachers.findIndex(t => t.id === id);
            this.data.teachers[index] = { ...this.data.teachers[index], ...teacherData };
        } else {
            teacherData.id = this.generateId();
            this.data.teachers.push(teacherData);
        }

        let users = JSON.parse(localStorage.getItem('schoolUsers') || '{"users":[]}');
        if (!users.users) users.users = [];
        
        const existingUser = users.users.find(u => u.teacherId === id && u.role === 'teacher');
        
        if (createAccount && username && password) {
            if (existingUser) {
                existingUser.username = username;
                existingUser.name = teacherData.name;
                existingUser.password = password;
            } else {
                if (!users.users.some(u => u.username === username)) {
                    users.users.push({
                        id: this.generateId(),
                        username: username,
                        password: password,
                        name: teacherData.name,
                        role: 'teacher',
                        teacherId: id || teacherData.id
                    });
                } else {
                    this.showToast('Bu kullanıcı adı zaten kullanılıyor!', 'error');
                    return;
                }
            }
            localStorage.setItem('schoolUsers', JSON.stringify(users));
        } else if (existingUser && !createAccount) {
            users.users = users.users.filter(u => u.id !== existingUser.id);
            localStorage.setItem('schoolUsers', JSON.stringify(users));
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
                            <input type="text" name="className" value="${this.data.settings.className || ''}" placeholder="örn: 7-A">
                        </div>
                        <div class="form-group">
                            <label>Sınıf Seviyesi</label>
                            <select name="classLevel">
                                <option value="">Seçin...</option>
                                ${[5,6,7,8,9,10,11,12].map(l => `<option value="${l}" ${this.data.settings.classLevel == l ? 'selected' : ''}>${l}. Sınıf</option>`).join('')}
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
                students: [], teachers: [], subjects: [], grades: [], schedule: [], exams: [], attendance: [],
                announcements: [], assignments: [], clubs: [], library: []
            };
            this.updateClassInfo();
            this.renderPage(this.currentPage);
            this.showToast('Tüm veriler silindi!');
        }
    },

    renderAnnouncements() {
        const announcements = (this.data.announcements || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return `
            <div class="page-header">
                <h1 class="page-title">Duyurular</h1>
                ${this.currentUser.role === 'admin' || this.currentUser.role === 'teacher' ? `
                    <button class="btn btn-primary" onclick="App.showAnnouncementModal()">
                        <i class="fas fa-plus"></i> Yeni Duyuru
                    </button>
                ` : ''}
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Önemli Duyurular</span>
                </div>
                ${announcements.filter(a => a.priority === 'high').map(a => this.renderAnnouncementCard(a)).join('') || '<p class="empty-state">Önemli duyuru yok</p>'}
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Tüm Duyurular</span>
                </div>
                ${announcements.length > 0 ? announcements.map(a => this.renderAnnouncementCard(a)).join('') : '<p class="empty-state">Henüz duyuru eklenmedi</p>'}
            </div>
        `;
    },

    renderAnnouncementCard(announcement) {
        const date = new Date(announcement.date);
        const isNew = (new Date() - date) < 86400000 * 3;
        
        return `
            <div class="announcement-card" onclick="App.viewAnnouncement('${announcement.id}')">
                <div class="announcement-header">
                    <div>
                        <span class="announcement-priority ${announcement.priority}">${announcement.priority === 'high' ? 'Önemli' : announcement.priority === 'normal' ? 'Normal' : 'Bilgi'}</span>
                        ${isNew ? '<span class="badge badge-success" style="margin-left: 8px;">Yeni</span>' : ''}
                    </div>
                    <span class="announcement-date">${date.toLocaleDateString('tr-TR')}</span>
                </div>
                <h3 class="announcement-title">${announcement.title}</h3>
                <p class="announcement-content">${announcement.content.substring(0, 150)}${announcement.content.length > 150 ? '...' : ''}</p>
                ${announcement.author ? `<p style="font-size: 12px; color: var(--gray-400); margin-top: 10px;">Yazar: ${announcement.author}</p>` : ''}
            </div>
        `;
    },

    showAnnouncementModal(id = null) {
        const announcement = id ? this.data.announcements.find(a => a.id === id) : null;
        
        const content = `
            <form id="announcementForm">
                <div class="form-group">
                    <label>Başlık *</label>
                    <input type="text" name="title" value="${announcement?.title || ''}" required>
                </div>
                <div class="form-group">
                    <label>İçerik *</label>
                    <textarea name="content" rows="5" required>${announcement?.content || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Öncelik</label>
                        <select name="priority">
                            <option value="low" ${announcement?.priority === 'low' ? 'selected' : ''}>Bilgi</option>
                            <option value="normal" ${announcement?.priority === 'normal' || !announcement ? 'selected' : ''}>Normal</option>
                            <option value="high" ${announcement?.priority === 'high' ? 'selected' : ''}>Önemli</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tarih</label>
                        <input type="date" name="date" value="${announcement?.date || new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Sil' : 'Kaydet', class: id ? 'btn-danger' : 'btn-primary', action: id ? `App.deleteAnnouncement('${id}')` : `App.saveAnnouncement()` }
        ];
        if (!id) {
            buttons.push({ text: 'Kaydet', class: 'btn-primary', action: 'App.saveAnnouncement()' });
            buttons.splice(1, 1);
        }
        this.showModal(id ? 'Duyuru Düzenle' : 'Yeni Duyuru', content, buttons);
    },

    saveAnnouncement(id = null) {
        const form = document.getElementById('announcementForm');
        const formData = new FormData(form);
        
        const announcementData = {
            title: formData.get('title'),
            content: formData.get('content'),
            priority: formData.get('priority'),
            date: formData.get('date') || new Date().toISOString().split('T')[0],
            author: this.currentUser.name
        };

        if (id) {
            const index = this.data.announcements.findIndex(a => a.id === id);
            this.data.announcements[index] = { ...this.data.announcements[index], ...announcementData };
        } else {
            this.data.announcements.push({ id: this.generateId(), ...announcementData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Duyuru güncellendi!' : 'Duyuru eklendi!');
    },

    deleteAnnouncement(id) {
        if (confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) {
            this.data.announcements = this.data.announcements.filter(a => a.id !== id);
            this.saveData();
            this.closeModal();
            this.renderPage(this.currentPage);
            this.showToast('Duyuru silindi!');
        }
    },

    viewAnnouncement(id) {
        const announcement = this.data.announcements.find(a => a.id === id);
        const date = new Date(announcement.date);
        
        const content = `
            <div style="margin-bottom: 20px;">
                <span class="announcement-priority ${announcement.priority}">${announcement.priority === 'high' ? 'Önemli' : announcement.priority === 'normal' ? 'Normal' : 'Bilgi'}</span>
            </div>
            <h2 style="margin-bottom: 15px;">${announcement.title}</h2>
            <p style="color: var(--gray-500); font-size: 13px; margin-bottom: 20px;">
                ${date.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - ${announcement.author}
            </p>
            <div style="line-height: 1.8; white-space: pre-wrap;">${announcement.content}</div>
        `;
        
        if (this.currentUser.role === 'admin' || this.currentUser.role === 'teacher') {
            this.showModal('Duyuru Detay', content, [
                { text: 'Kapat', action: 'App.closeModal()' },
                { text: 'Düzenle', class: 'btn-secondary', action: `App.showAnnouncementModal('${id}')` }
            ]);
        } else {
            this.showModal('Duyuru Detay', content, [{ text: 'Kapat', action: 'App.closeModal()' }]);
        }
    },

    renderGradeAnalysis() {
        const role = this.currentUser.role;
        let studentId = role === 'student' ? this.currentUser.studentId : null;
        
        const subjects = [...new Set(this.data.grades.map(g => g.subject))];
        const subjectAnalysis = subjects.map(subject => {
            const subjectGrades = this.data.grades
                .filter(g => g.subject === subject && (!studentId || g.studentId === studentId))
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            if (subjectGrades.length < 2) return null;
            
            const firstHalf = subjectGrades.slice(0, Math.floor(subjectGrades.length / 2));
            const secondHalf = subjectGrades.slice(Math.floor(subjectGrades.length / 2));
            
            const firstAvg = firstHalf.reduce((a, g) => a + parseFloat(g.score), 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((a, g) => a + parseFloat(g.score), 0) / secondHalf.length;
            const change = ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1);
            
            const recentGrades = subjectGrades.slice(-5);
            const trend = recentGrades.map(g => parseFloat(g.score));
            
            return {
                subject,
                avg: (subjectGrades.reduce((a, g) => a + parseFloat(g.score), 0) / subjectGrades.length).toFixed(1),
                count: subjectGrades.length,
                change,
                trend,
                labels: recentGrades.map(g => g.date.split('-')[2] + '/' + g.date.split('-')[1])
            };
        }).filter(Boolean);

        return `
            <div class="page-header">
                <h1 class="page-title">Not Analizi</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 25px;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-book"></i></div>
                    <div class="stat-info">
                        <h4>${subjects.length}</h4>
                        <p>Toplam Ders</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-arrow-up"></i></div>
                    <div class="stat-info">
                        <h4>${subjectAnalysis.filter(s => s && parseFloat(s.change) > 0).length}</h4>
                        <p>İyileşen Ders</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-arrow-down"></i></div>
                    <div class="stat-info">
                        <h4>${subjectAnalysis.filter(s => s && parseFloat(s.change) < 0).length}</h4>
                        <p>Gerileyen Ders</p>
                    </div>
                </div>
            </div>

            ${subjectAnalysis.length > 0 ? `
                <div class="card" style="margin-bottom: 20px;">
                    <div class="card-header">
                        <span class="card-title">Ders Bazlı Analiz</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
                        ${subjectAnalysis.map(s => `
                            <div style="padding: 15px; background: var(--gray-100); border-radius: var(--radius);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <strong>${s.subject}</strong>
                                    <span class="development-indicator ${parseFloat(s.change) > 0 ? 'up' : parseFloat(s.change) < 0 ? 'down' : 'stable'}">
                                        %${Math.abs(s.change)}
                                    </span>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--gray-500); margin-bottom: 10px;">
                                    <span>Ortalama: ${s.avg}</span>
                                    <span>${s.count} sınav</span>
                                </div>
                                <div class="grade-progress">
                                    <div class="grade-progress-bar">
                                        <div class="grade-progress-fill ${parseFloat(s.avg) >= 70 ? 'high' : parseFloat(s.avg) >= 50 ? 'medium' : 'low'}" style="width: ${s.avg}%"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Not Grafikleri</span>
                    </div>
                    <div style="padding: 20px;">
                        <canvas id="gradeChart" height="300"></canvas>
                    </div>
                </div>
            ` : '<div class="card"><p class="empty-state">Analiz için en az 2 sınav gerekli</p></div>'}
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
        
        if (page === 'gradeanalysis') {
            this.initGradeChart();
        }
    },

    initGradeChart() {
        const role = this.currentUser.role;
        let studentId = role === 'student' ? this.currentUser.studentId : null;
        
        const ctx = document.getElementById('gradeChart');
        if (!ctx) return;
        
        const subjects = [...new Set(this.data.grades.map(g => g.subject))];
        const datasets = subjects.map((subject, index) => {
            const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7'];
            const subjectGrades = this.data.grades
                .filter(g => g.subject === subject && (!studentId || g.studentId === studentId))
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            return {
                label: subject,
                data: subjectGrades.map(g => parseFloat(g.score)),
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                tension: 0.4,
                fill: true
            };
        });

        if (window.gradeChartInstance) {
            window.gradeChartInstance.destroy();
        }

        window.gradeChartInstance = new Chart(ctx, {
            type: 'line',
            data: { labels: ['1', '2', '3', '4', '5'], datasets },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Not Gelişimi' }
                },
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    },

    renderAssignments() {
        return `
            <div class="page-header">
                <h1 class="page-title">Ödev Yönetimi</h1>
                ${this.currentUser.role === 'admin' || this.currentUser.role === 'teacher' ? `
                    <button class="btn btn-primary" onclick="App.showAssignmentModal()">
                        <i class="fas fa-plus"></i> Yeni Ödev
                    </button>
                ` : ''}
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Ödevler</span>
                </div>
                ${this.renderAssignmentsList()}
            </div>
        `;
    },

    renderAssignmentsList() {
        const assignments = (this.data.assignments || []).sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        
        if (assignments.length === 0) {
            return '<p class="empty-state">Henüz ödev eklenmedi</p>';
        }

        return assignments.map(a => {
            const isOverdue = new Date(a.dueDate) < new Date() && a.status !== 'submitted';
            const statusClass = a.status === 'submitted' ? 'submitted' : isOverdue ? 'pending' : 'pending';
            
            return `
                <div class="assignment-card">
                    <div class="assignment-header">
                        <div class="assignment-title">
                            <i class="fas fa-tasks"></i>
                            ${a.title}
                        </div>
                        <span class="assignment-status ${statusClass}">
                            ${a.status === 'submitted' ? 'Teslim Edildi' : isOverdue ? 'Süresi Geçti' : 'Bekliyor'}
                        </span>
                    </div>
                    <p style="color: var(--gray-500); font-size: 14px; margin-bottom: 10px;">${a.description}</p>
                    <div class="assignment-meta">
                        <span><i class="fas fa-book"></i> ${a.subject}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(a.dueDate).toLocaleDateString('tr-TR')}</span>
                        ${a.grade !== null ? `<span><i class="fas fa-star"></i> ${a.grade}/100</span>` : ''}
                    </div>
                    ${this.currentUser.role === 'admin' || this.currentUser.role === 'teacher' ? `
                        <div style="margin-top: 15px; display: flex; gap: 10px;">
                            <button class="btn btn-secondary" onclick="App.showAssignmentModal('${a.id}')" style="padding: 5px 15px; font-size: 12px;">
                                <i class="fas fa-edit"></i> Düzenle
                            </button>
                            <button class="btn btn-danger" onclick="App.deleteAssignment('${a.id}')" style="padding: 5px 15px; font-size: 12px;">
                                <i class="fas fa-trash"></i> Sil
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    showAssignmentModal(id = null) {
        const assignment = id ? this.data.assignments.find(a => a.id === id) : null;
        
        const content = `
            <form id="assignmentForm">
                <div class="form-group">
                    <label>Ödev Başlığı *</label>
                    <input type="text" name="title" value="${assignment?.title || ''}" required>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="3">${assignment?.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Ders *</label>
                        <input type="text" name="subject" value="${assignment?.subject || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Son Teslim Tarihi *</label>
                        <input type="date" name="dueDate" value="${assignment?.dueDate || ''}" required>
                    </div>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Güncelle' : 'Kaydet', class: 'btn-primary', action: `App.saveAssignment('${id || ''}')` }
        ];
        this.showModal(id ? 'Ödev Düzenle' : 'Yeni Ödev', content, buttons);
    },

    saveAssignment(id) {
        const form = document.getElementById('assignmentForm');
        const formData = new FormData(form);
        
        const assignmentData = {
            title: formData.get('title'),
            description: formData.get('description'),
            subject: formData.get('subject'),
            dueDate: formData.get('dueDate'),
            status: 'pending',
            grade: null
        };

        if (id) {
            const index = this.data.assignments.findIndex(a => a.id === id);
            this.data.assignments[index] = { ...this.data.assignments[index], ...assignmentData };
        } else {
            this.data.assignments.push({ id: this.generateId(), ...assignmentData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Ödev güncellendi!' : 'Ödev eklendi!');
    },

    deleteAssignment(id) {
        if (confirm('Bu ödevi silmek istediğinize emin misiniz?')) {
            this.data.assignments = this.data.assignments.filter(a => a.id !== id);
            this.saveData();
            this.closeModal();
            this.renderPage(this.currentPage);
            this.showToast('Ödev silindi!');
        }
    },

    renderMyAssignments() {
        return `
            <div class="page-header">
                <h1 class="page-title">Ödevlerim</h1>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Ödevlerim</span>
                </div>
                ${this.renderAssignmentsList()}
            </div>
        `;
    },

    renderClubs() {
        return `
            <div class="page-header">
                <h1 class="page-title">Kulüpler</h1>
                ${this.currentUser.role === 'admin' || this.currentUser.role === 'teacher' ? `
                    <button class="btn btn-primary" onclick="App.showClubModal()">
                        <i class="fas fa-plus"></i> Yeni Kulüp
                    </button>
                ` : ''}
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                ${this.renderClubsList()}
            </div>
        `;
    },

    renderClubsList() {
        if (!this.data.clubs || this.data.clubs.length === 0) {
            return '<div class="card" style="grid-column: 1/-1;"><p class="empty-state">Henüz kulüp eklenmedi</p></div>';
        }

        return this.data.clubs.map((club, i) => `
            <div class="club-card" onclick="App.viewClub('${club.id}')">
                <div class="club-icon ${icons[i % icons.length]}">
                    <i class="fas fa-${club.icon || 'users'}"></i>
                </div>
                <h3 class="club-name">${club.name}</h3>
                <p class="club-members">${club.members?.length || 0} üye</p>
                ${club.description ? `<p style="font-size: 12px; color: var(--gray-500); margin-top: 10px;">${club.description.substring(0, 60)}...</p>` : ''}
            </div>
        `).join('');
    },

    showClubModal(id = null) {
        const club = id ? this.data.clubs.find(c => c.id === id) : null;
        const icons = ['users', 'music', 'book', 'palette', 'football', 'science', 'laptop', 'camera', 'plane'];
        
        const content = `
            <form id="clubForm">
                <div class="form-group">
                    <label>Kulüp Adı *</label>
                    <input type="text" name="name" value="${club?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="3">${club?.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>İkon</label>
                    <select name="icon">
                        ${icons.map(icon => `<option value="${icon}" ${club?.icon === icon ? 'selected' : ''}>${icon}</option>`).join('')}
                    </select>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Sil' : 'Kaydet', class: id ? 'btn-danger' : 'btn-primary', action: id ? `App.deleteClub('${id}')` : 'App.saveClub()' }
        ];
        if (!id) {
            buttons.push({ text: 'Kaydet', class: 'btn-primary', action: 'App.saveClub()' });
            buttons.splice(1, 1);
        }
        this.showModal(id ? 'Kulüp Düzenle' : 'Yeni Kulüp', content, buttons);
    },

    saveClub(id = null) {
        const form = document.getElementById('clubForm');
        const formData = new FormData(form);
        
        const clubData = {
            name: formData.get('name'),
            description: formData.get('description'),
            icon: formData.get('icon'),
            members: id ? (this.data.clubs.find(c => c.id === id)?.members || []) : []
        };

        if (id) {
            const index = this.data.clubs.findIndex(c => c.id === id);
            this.data.clubs[index] = { ...this.data.clubs[index], ...clubData };
        } else {
            this.data.clubs.push({ id: this.generateId(), ...clubData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Kulüp güncellendi!' : 'Kulüp eklendi!');
    },

    deleteClub(id) {
        if (confirm('Bu kulübü silmek istediğinize emin misiniz?')) {
            this.data.clubs = this.data.clubs.filter(c => c.id !== id);
            this.saveData();
            this.closeModal();
            this.renderPage(this.currentPage);
            this.showToast('Kulüp silindi!');
        }
    },

    viewClub(id) {
        const club = this.data.clubs.find(c => c.id === id);
        const isMember = club.members?.includes(this.currentUser.id);
        
        const content = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div class="club-icon blue" style="width: 80px; height: 80px; font-size: 32px; margin: 0 auto;">
                    <i class="fas fa-${club.icon || 'users'}"></i>
                </div>
                <h2 style="margin-top: 15px;">${club.name}</h2>
                <p style="color: var(--gray-500);">${club.members?.length || 0} üye</p>
            </div>
            <p style="line-height: 1.6;">${club.description || 'Açıklama yok'}</p>
            ${this.currentUser.role === 'student' ? `
                <button class="btn ${isMember ? 'btn-danger' : 'btn-primary'}" style="width: 100%; margin-top: 20px;" onclick="App.toggleClubMembership('${id}')">
                    <i class="fas fa-${isMember ? 'sign-out-alt' : 'user-plus'}"></i> 
                    ${isMember ? 'Kulüpten Ayrıl' : 'Kulübe Katıl'}
                </button>
            ` : ''}
        `;
        this.showModal('Kulüp Detay', content, [{ text: 'Kapat', action: 'App.closeModal()' }]);
    },

    toggleClubMembership(clubId) {
        const club = this.data.clubs.find(c => c.id === clubId);
        if (!club.members) club.members = [];
        
        const index = club.members.indexOf(this.currentUser.id);
        if (index > -1) {
            club.members.splice(index, 1);
            this.showToast('Kulüpten ayrıldınız!');
        } else {
            club.members.push(this.currentUser.id);
            this.showToast('Kulübe katıldınız!');
        }
        
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
    },

    renderLibrary() {
        return `
            <div class="page-header">
                <h1 class="page-title">Kütüphane</h1>
                ${this.currentUser.role === 'admin' || this.currentUser.role === 'teacher' ? `
                    <button class="btn btn-primary" onclick="App.showBookModal()">
                        <i class="fas fa-plus"></i> Kitap Ekle
                    </button>
                ` : ''}
            </div>

            <div class="search-filter" style="margin-bottom: 20px;">
                <input type="text" id="bookSearch" placeholder="Kitap veya yazar ara..." oninput="App.filterBooks()">
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Mevcut Kitaplar</span>
                </div>
                <div id="booksList">
                    ${this.renderBooksList()}
                </div>
            </div>
        `;
    },

    renderBooksList() {
        if (!this.data.library || this.data.library.length === 0) {
            return '<p class="empty-state">Henüz kitap eklenmedi</p>';
        }

        return this.data.library.map(book => `
            <div class="library-book">
                <div class="library-book-icon">
                    <i class="fas fa-book"></i>
                </div>
                <div class="library-book-info">
                    <h4 class="library-book-title">${book.title}</h4>
                    <p class="library-book-author">${book.author} - ${book.publisher || ''}</p>
                </div>
                <span class="library-status ${book.borrower ? 'borrowed' : 'available'}">
                    ${book.borrower ? 'Ödünçte' : 'Mevcut'}
                </span>
                ${!book.borrower && this.currentUser.role === 'student' ? `
                    <button class="btn btn-secondary" style="padding: 5px 15px; margin-left: 10px;" onclick="App.borrowBook('${book.id}')">
                        Ödünç Al
                    </button>
                ` : book.borrower === this.currentUser.id ? `
                    <button class="btn btn-success" style="padding: 5px 15px; margin-left: 10px;" onclick="App.returnBook('${book.id}')">
                        İade Et
                    </button>
                ` : ''}
                ${this.currentUser.role === 'admin' || this.currentUser.role === 'teacher' ? `
                    <button class="action-btn delete" onclick="App.deleteBook('${book.id}')" style="margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `).join('');
    },

    filterBooks() {
        const query = document.getElementById('bookSearch').value.toLowerCase();
        const filtered = this.data.library.filter(b => 
            b.title.toLowerCase().includes(query) || 
            b.author.toLowerCase().includes(query)
        );
        document.getElementById('booksList').innerHTML = filtered.length > 0 
            ? filtered.map(book => this.renderSingleBook(book)).join('')
            : '<p class="empty-state">Sonuç bulunamadı</p>';
    },

    renderSingleBook(book) {
        return `
            <div class="library-book">
                <div class="library-book-icon">
                    <i class="fas fa-book"></i>
                </div>
                <div class="library-book-info">
                    <h4 class="library-book-title">${book.title}</h4>
                    <p class="library-book-author">${book.author}</p>
                </div>
                <span class="library-status ${book.borrower ? 'borrowed' : 'available'}">
                    ${book.borrower ? 'Ödünçte' : 'Mevcut'}
                </span>
            </div>
        `;
    },

    showBookModal(id = null) {
        const book = id ? this.data.library.find(b => b.id === id) : null;
        
        const content = `
            <form id="bookForm">
                <div class="form-group">
                    <label>Kitap Adı *</label>
                    <input type="text" name="title" value="${book?.title || ''}" required>
                </div>
                <div class="form-group">
                    <label>Yazar *</label>
                    <input type="text" name="author" value="${book?.author || ''}" required>
                </div>
                <div class="form-group">
                    <label>Yayınevi</label>
                    <input type="text" name="publisher" value="${book?.publisher || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>ISBN</label>
                        <input type="text" name="isbn" value="${book?.isbn || ''}">
                    </div>
                    <div class="form-group">
                        <label>Sayfa Sayısı</label>
                        <input type="number" name="pages" value="${book?.pages || ''}">
                    </div>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: id ? 'Güncelle' : 'Kaydet', class: 'btn-primary', action: `App.saveBook('${id || ''}')` }
        ];
        this.showModal(id ? 'Kitap Düzenle' : 'Yeni Kitap', content, buttons);
    },

    saveBook(id) {
        const form = document.getElementById('bookForm');
        const formData = new FormData(form);
        
        const bookData = {
            title: formData.get('title'),
            author: formData.get('author'),
            publisher: formData.get('publisher'),
            isbn: formData.get('isbn'),
            pages: formData.get('pages'),
            borrower: id ? (this.data.library.find(b => b.id === id)?.borrower || null) : null,
            borrowDate: id ? (this.data.library.find(b => b.id === id)?.borrowDate || null) : null
        };

        if (id) {
            const index = this.data.library.findIndex(b => b.id === id);
            this.data.library[index] = { ...this.data.library[index], ...bookData };
        } else {
            this.data.library.push({ id: this.generateId(), ...bookData });
        }

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast(id ? 'Kitap güncellendi!' : 'Kitap eklendi!');
    },

    deleteBook(id) {
        if (confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
            this.data.library = this.data.library.filter(b => b.id !== id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Kitap silindi!');
        }
    },

    borrowBook(id) {
        const book = this.data.library.find(b => b.id === id);
        book.borrower = this.currentUser.id;
        book.borrowDate = new Date().toISOString().split('T')[0];
        this.saveData();
        this.renderPage(this.currentPage);
        this.showToast('Kitap ödünç alındı!');
    },

    returnBook(id) {
        const book = this.data.library.find(b => b.id === id);
        book.borrower = null;
        book.borrowDate = null;
        this.saveData();
        this.renderPage(this.currentPage);
        this.showToast('Kitap iade edildi!');
    },

    renderBadges() {
        const badges = [
            { id: 'bookworm', name: 'Kitap Kurdu', icon: 'fa-book-open', color: '#8b5cf6', desc: '10 kitap oku' },
            { id: 'homework', name: 'Ödev Canavarı', icon: 'fa-tasks', color: '#10b981', desc: '10 ödevi zamanında teslim et' },
            { id: 'punctual', name: 'Dakik Öğrenci', icon: 'fa-clock', color: '#f59e0b', desc: 'Bir ay boyunca geç kalma' },
            { id: 'star', name: 'Yıldız Öğrenci', icon: 'fa-star', color: '#fbbf24', desc: '50 yıldız puan topla' },
            { id: 'helper', name: 'Süper Yardımcı', icon: 'fa-hands-helping', color: '#3b82f6', desc: '10 kez arkadaşlarına yardım et' },
            { id: 'reader', name: 'Okuma Ustası', icon: 'fa-glasses', color: '#ec4899', desc: '20 kitap oku' },
            { id: 'scientist', name: 'Bilim İnsanı', icon: 'fa-flask', color: '#06b6d4', desc: 'Fen dersinde 5 ödev yap' },
            { id: 'math', name: 'Matematik Dehası', icon: 'fa-calculator', color: '#ef4444', desc: 'Matematik notunu 90 üzerine çıkar' },
            { id: 'perfect', name: 'Mükemmel Ay', icon: 'fa-crown', color: '#fbbf24', desc: 'Bir ay boyunca hiç devamsızlık yapma' },
            { id: 'social', name: 'Sosyal Kelebek', icon: 'fa-comments', color: '#a855f7', desc: '10 soru sor veya cevapla' }
        ];
        this.data.badges = badges;
        this.saveData();

        return `
            <div class="page-header">
                <h1 class="page-title">Rozet Sistemi</h1>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Kazanılabilecek Rozetler</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; padding: 15px;">
                    ${badges.map(b => `
                        <div style="text-align: center; padding: 20px; background: var(--gray-100); border-radius: var(--radius); transition: all 0.3s;">
                            <div style="width: 60px; height: 60px; background: ${b.color}; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas ${b.icon}" style="color: white; font-size: 24px;"></i>
                            </div>
                            <h4 style="margin-bottom: 5px; font-size: 14px;">${b.name}</h4>
                            <p style="font-size: 12px; color: var(--gray-500);">${b.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Rozet Ver</span>
                </div>
                <form id="giveBadgeForm" style="padding: 15px;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Öğrenci Seç</label>
                            <select name="studentId" required>
                                <option value="">Seçin...</option>
                                ${this.data.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Rozet Seç</label>
                            <select name="badgeId" required>
                                <option value="">Seçin...</option>
                                ${badges.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="App.giveBadge()">
                        <i class="fas fa-award"></i> Rozet Ver
                    </button>
                </form>
            </div>
        `;
    },

    giveBadge() {
        const form = document.getElementById('giveBadgeForm');
        const studentId = form.querySelector('[name="studentId"]').value;
        const badgeId = form.querySelector('[name="badgeId"]').value;

        if (!studentId || !badgeId) {
            this.showToast('Lütfen öğrenci ve rozet seçin!', 'error');
            return;
        }

        const student = this.data.students.find(s => s.id === studentId);
        if (!student.badges) student.badges = [];

        if (student.badges.includes(badgeId)) {
            this.showToast('Bu öğrenci bu rozeti zaten kazandı!', 'error');
            return;
        }

        student.badges.push(badgeId);
        this.saveData();
        this.showToast(`${student.name} rozet kazandı! 🎉`);
        this.renderPage(this.currentPage);
    },

    renderMyBadges() {
        const studentId = this.currentUser.studentId;
        const student = this.data.students.find(s => s.id === studentId);
        const earnedBadges = student?.badges || [];
        
        const allBadges = [
            { id: 'bookworm', name: 'Kitap Kurdu', icon: 'fa-book-open', color: '#8b5cf6' },
            { id: 'homework', name: 'Ödev Canavarı', icon: 'fa-tasks', color: '#10b981' },
            { id: 'punctual', name: 'Dakik Öğrenci', icon: 'fa-clock', color: '#f59e0b' },
            { id: 'star', name: 'Yıldız Öğrenci', icon: 'fa-star', color: '#fbbf24' },
            { id: 'helper', name: 'Süper Yardımcı', icon: 'fa-hands-helping', color: '#3b82f6' },
            { id: 'reader', name: 'Okuma Ustası', icon: 'fa-glasses', color: '#ec4899' }
        ];

        return `
            <div class="page-header">
                <h1 class="page-title">Rozetlerim 🏆</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-award"></i></div>
                    <div class="stat-info">
                        <h4>${earnedBadges.length}</h4>
                        <p>Kazanılan Rozet</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-medal"></i></div>
                    <div class="stat-info">
                        <h4>${allBadges.length - earnedBadges.length}</h4>
                        <p>Kalan Rozet</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Rozetlerim</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; padding: 15px;">
                    ${allBadges.map(b => {
                        const earned = earnedBadges.includes(b.id);
                        return `
                            <div style="text-align: center; padding: 20px; background: ${earned ? 'var(--gray-100)' : 'var(--gray-50)'}; border-radius: var(--radius); opacity: ${earned ? '1' : '0.4'}; ${earned ? 'border: 2px solid ' + b.color : ''}">
                                <div style="width: 50px; height: 50px; background: ${earned ? b.color : '#ccc'}; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas ${b.icon}" style="color: white; font-size: 20px;"></i>
                                </div>
                                <h4 style="font-size: 13px;">${b.name}</h4>
                                ${earned ? '<span class="badge badge-success" style="font-size: 10px;">Kazanıldı!</span>' : '<span style="font-size: 10px; color: var(--gray-400);">🔒 Kilitli</span>'}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderLeaderboard() {
        const studentPoints = this.data.students.map(s => {
            const stars = (this.data.starPoints || []).filter(p => p.studentId === s.id).reduce((a, p) => a + p.points, 0);
            const books = (this.data.library || []).filter(b => b.borrower === s.id).length;
            const badges = s.badges?.length || 0;
            return { ...s, stars, books, badges, total: stars + (books * 5) + (badges * 10) };
        }).sort((a, b) => b.total - a.total);

        return `
            <div class="page-header">
                <h1 class="page-title">🏆 Liderlik Tablosu</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-star"></i></div>
                    <div class="stat-info">
                        <h4>${studentPoints[0]?.stars || 0}</h4>
                        <p>En Çok Yıldız</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-book"></i></div>
                    <div class="stat-info">
                        <h4>${studentPoints[0]?.books || 0}</h4>
                        <p>En Çok Kitap</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Haftalık Sıralama</span>
                </div>
                <div style="padding: 15px;">
                    ${studentPoints.slice(0, 10).map((s, i) => {
                        const medals = ['🥇', '🥈', '🥉'];
                        const bg = i === 0 ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : i === 1 ? 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' : i === 2 ? 'linear-gradient(135deg, #fef3c7, #fcd34d)' : '';
                        return `
                            <div style="display: flex; align-items: center; padding: 12px; margin-bottom: 8px; background: ${bg || 'var(--gray-100)'}; border-radius: var(--radius);">
                                <div style="width: 35px; height: 35px; background: ${i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : 'var(--gray-300)'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 15px;">
                                    ${i < 3 ? medals[i] : i + 1}
                                </div>
                                <div class="student-avatar" style="margin-right: 15px;">${s.name.charAt(0)}</div>
                                <div style="flex: 1;">
                                    <strong>${s.name}</strong>
                                    <div style="font-size: 12px; color: var(--gray-500);">
                                        ⭐ ${s.stars} yıldız | 📚 ${s.books} kitap | 🏅 ${s.badges} rozet
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <strong style="font-size: 18px; color: var(--primary);">${s.total}</strong>
                                    <div style="font-size: 11px; color: var(--gray-500);">puan</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    ${studentPoints.length === 0 ? '<p class="empty-state">Henüz veri yok</p>' : ''}
                </div>
            </div>
        `;
    },

    renderStars() {
        const recentStars = (this.data.starPoints || []).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);

        return `
            <div class="page-header">
                <h1 class="page-title">⭐ Yıldız Puanı Sistemi</h1>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Yıldız Ver</span>
                </div>
                <form id="giveStarForm" style="padding: 15px;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Öğrenci Seç</label>
                            <select name="studentId" required>
                                <option value="">Seçin...</option>
                                ${this.data.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Puan Miktarı</label>
                            <select name="points" required>
                                <option value="1">⭐ 1 Yıldız</option>
                                <option value="2">⭐⭐ 2 Yıldız</option>
                                <option value="5">⭐⭐⭐⭐⭐ 5 Yıldız</option>
                                <option value="10">🌟 10 Yıldız</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Sebep</label>
                        <select name="reason" required>
                            <option value="dakika">✅ Dakik geldi</option>
                            <option value="soru">❓ Soru sordu</option>
                            <option value="yardim">🤝 Arkadaşına yardım etti</option>
                            <option value="sorumluluk">📋 Sorumluluk sahibi</option>
                            <option value="basari">🎯 Başarılı sunum</option>
                            <option value="diger">⭐ Diğer</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="App.giveStar()">
                        <i class="fas fa-star"></i> Yıldız Ver
                    </button>
                </form>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Son Verilen Yıldızlar</span>
                </div>
                <div style="padding: 15px;">
                    ${recentStars.length > 0 ? recentStars.map(s => {
                        const student = this.data.students.find(st => st.id === s.studentId);
                        return `
                            <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                                <div>
                                    <strong>${student?.name || 'Bilinmiyor'}</strong>
                                    <span style="color: var(--gray-500); font-size: 13px; margin-left: 10px;">${s.reason}</span>
                                </div>
                                <div>
                                    <span style="color: #fbbf24; font-size: 18px;">${'⭐'.repeat(s.points)}</span>
                                    <span style="color: var(--gray-400); font-size: 12px; margin-left: 10px;">${s.date}</span>
                                </div>
                            </div>
                        `;
                    }).join('') : '<p class="empty-state">Henüz yıldız verilmedi</p>'}
                </div>
            </div>
        `;
    },

    giveStar() {
        const form = document.getElementById('giveStarForm');
        const studentId = form.querySelector('[name="studentId"]').value;
        const points = parseInt(form.querySelector('[name="points"]').value);
        const reason = form.querySelector('[name="reason"]').value;

        if (!studentId) {
            this.showToast('Lütfen öğrenci seçin!', 'error');
            return;
        }

        if (!this.data.starPoints) this.data.starPoints = [];
        this.data.starPoints.push({
            id: this.generateId(),
            studentId,
            points,
            reason,
            date: new Date().toISOString().split('T')[0],
            givenBy: this.currentUser.name
        });

        const student = this.data.students.find(s => s.id === studentId);
        this.saveData();
        this.showToast(`${student?.name} ${points} yıldız kazandı! ⭐`);
        this.renderPage(this.currentPage);
    },

    renderMyStars() {
        const studentId = this.currentUser.studentId;
        const myStars = (this.data.starPoints || []).filter(p => p.studentId === studentId);
        const totalStars = myStars.reduce((a, p) => a + p.points, 0);

        return `
            <div class="page-header">
                <h1 class="page-title">⭐ Yıldızlarım</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-star"></i></div>
                    <div class="stat-info">
                        <h4>${totalStars}</h4>
                        <p>Toplam Yıldız</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-trophy"></i></div>
                    <div class="stat-info">
                        <h4>${myStars.length}</h4>
                        <p>Kazanma Sayısı</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Yıldız Kazanma Geçmişim</span>
                </div>
                <div style="padding: 15px;">
                    ${myStars.sort((a, b) => new Date(b.date) - new Date(a.date)).map(s => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--gray-200);">
                            <div>
                                <span style="font-size: 18px; color: #fbbf24;">${'⭐'.repeat(s.points)}</span>
                            </div>
                            <div style="flex: 1; margin-left: 15px;">
                                <strong>${this.getStarReasonText(s.reason)}</strong>
                                <div style="font-size: 12px; color: var(--gray-500);">${s.date} - ${s.givenBy}</div>
                            </div>
                        </div>
                    `).join('')}
                    ${myStars.length === 0 ? '<p class="empty-state">Henüz yıldız kazanmadın</p>' : ''}
                </div>
            </div>
        `;
    },

    getStarReasonText(reason) {
        const reasons = {
            dakika: 'Dakik geldi',
            soru: 'Soru sordu',
            yardim: 'Yardımsever davranış',
            sorumluluk: 'Sorumluluk sahibi',
            basari: 'Başarılı sunum',
            diger: 'Özel katkı'
        };
        return reasons[reason] || reason;
    },

    renderMood() {
        const today = new Date().toISOString().split('T')[0];
        const todayMood = (this.data.moods || []).find(m => m.studentId === this.currentUser.studentId && m.date === today);

        return `
            <div class="page-header">
                <h1 class="page-title">😊 Bugün Nasıl Hissediyorsun?</h1>
            </div>

            <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
                <div style="padding: 30px;">
                    ${todayMood ? `
                        <div style="font-size: 80px; margin-bottom: 20px;">${this.getMoodEmoji(todayMood.mood)}</div>
                        <h2>${todayMood.mood === 'great' ? 'Harika!' : todayMood.mood === 'good' ? 'İyi!' : todayMood.mood === 'okay' ? 'Fena değil' : todayMood.mood === 'bad' ? 'Kötü' : 'Çok Kötü'}</h2>
                        <p style="color: var(--gray-500); margin-top: 10px;">Bugün bu ruh halini seçtin</p>
                        <button class="btn btn-secondary" style="margin-top: 20px;" onclick="App.updateMood()">
                            <i class="fas fa-edit"></i> Değiştir
                        </button>
                    ` : `
                        <p style="margin-bottom: 20px; color: var(--gray-500);">Şu an nasıl hissediyorsun?</p>
                        <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 30px;">
                            <button class="mood-btn" onclick="App.saveMood('great')" style="font-size: 50px; background: none; border: none; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😍</button>
                            <button class="mood-btn" onclick="App.saveMood('good')" style="font-size: 50px; background: none; border: none; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😊</button>
                            <button class="mood-btn" onclick="App.saveMood('okay')" style="font-size: 50px; background: none; border: none; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😐</button>
                            <button class="mood-btn" onclick="App.saveMood('bad')" style="font-size: 50px; background: none; border: none; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😔</button>
                            <button class="mood-btn" onclick="App.saveMood('terrible')" style="font-size: 50px; background: none; border: none; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">😢</button>
                        </div>
                        <p style="font-size: 14px; color: var(--gray-400);">Bugün nasıl hissetiğini seçersen rehberlik servisi seni daha iyi anlayabilir</p>
                    `}
                </div>
            </div>
        `;
    },

    getMoodEmoji(mood) {
        const emojis = { great: '😍', good: '😊', okay: '😐', bad: '😔', terrible: '😢' };
        return emojis[mood] || '😐';
    },

    saveMood(mood) {
        const today = new Date().toISOString().split('T')[0];
        if (!this.data.moods) this.data.moods = [];
        
        const existingIndex = this.data.moods.findIndex(m => m.studentId === this.currentUser.studentId && m.date === today);
        const moodEntry = {
            id: this.generateId(),
            studentId: this.currentUser.studentId,
            mood,
            date: today
        };

        if (existingIndex >= 0) {
            this.data.moods[existingIndex] = moodEntry;
        } else {
            this.data.moods.push(moodEntry);
        }

        this.saveData();
        this.showToast('Ruh halin kaydedildi! 💙');
        this.renderPage(this.currentPage);
    },

    updateMood() {
        this.renderMood();
    },

    renderChildMood() {
        const studentId = this.currentUser.studentId;
        const student = this.data.students.find(s => s.id === studentId);
        const moods = (this.data.moods || []).filter(m => m.studentId === studentId).slice(-7).reverse();

        return `
            <div class="page-header">
                <h1 class="page-title">😊 ${student?.name || 'Çocuğunuz'}un Ruh Hali</h1>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Son 7 Gün</span>
                </div>
                <div style="display: flex; justify-content: space-around; padding: 20px;">
                    ${['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, i) => {
                        const mood = moods[i];
                        return `
                            <div style="text-align: center;">
                                <div style="font-size: 30px; margin-bottom: 5px;">${mood ? this.getMoodEmoji(mood.mood) : '❓'}</div>
                                <div style="font-size: 11px; color: var(--gray-500);">${day.substring(0, 3)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Son Ruht Hali Kayıtları</span>
                </div>
                <div style="padding: 15px;">
                    ${moods.map(m => `
                        <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                            <span style="font-size: 30px; margin-right: 15px;">${this.getMoodEmoji(m.mood)}</span>
                            <div>
                                <strong>${this.getMoodText(m.mood)}</strong>
                                <div style="font-size: 12px; color: var(--gray-500);">${m.date}</div>
                            </div>
                        </div>
                    `).join('')}
                    ${moods.length === 0 ? '<p class="empty-state">Henüz ruh hali kaydı yok</p>' : ''}
                </div>
            </div>
        `;
    },

    getMoodText(mood) {
        const texts = { great: 'Harika hissediyor', good: 'İyi hissediyor', okay: 'Normal', bad: 'Kötü hissediyor', terrible: 'Çok kötü hissediyor' };
        return texts[mood] || 'Bilinmiyor';
    },

    renderGoals() {
        return `
            <div class="page-header">
                <h1 class="page-title">🎯 Hedefler</h1>
                <button class="btn btn-primary" onclick="App.showGoalModal()">
                    <i class="fas fa-plus"></i> Yeni Hedef
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Aktif Hedefler</span>
                </div>
                ${this.renderGoalsList('active')}
            </div>

            <div class="card" style="margin-top: 20px;">
                <div class="card-header">
                    <span class="card-title">Tamamlanan Hedefler</span>
                </div>
                ${this.renderGoalsList('completed')}
            </div>
        `;
    },

    renderGoalsList(status) {
        const goals = (this.data.goals || []).filter(g => {
            const isCompleted = g.completed;
            return status === 'completed' ? isCompleted : !isCompleted;
        });

        if (goals.length === 0) {
            return '<p class="empty-state">' + (status === 'completed' ? 'Henüz tamamlanan hedef yok' : 'Henüz hedef eklenmedi') + '</p>';
        }

        return goals.map(g => `
            <div style="padding: 15px; border-bottom: 1px solid var(--gray-200);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${g.title}</strong>
                        <p style="font-size: 13px; color: var(--gray-500); margin-top: 5px;">${g.description}</p>
                        <div style="margin-top: 10px;">
                            <div class="grade-progress">
                                <div class="grade-progress-bar">
                                    <div class="grade-progress-fill ${g.progress >= 100 ? 'high' : 'medium'}" style="width: ${Math.min(g.progress, 100)}%"></div>
                                </div>
                            </div>
                            <span style="font-size: 12px; color: var(--gray-500);">${g.progress}% tamamlandı - Hedef: ${g.targetDate}</span>
                        </div>
                    </div>
                    <div>
                        ${status === 'active' ? `
                            <button class="btn btn-success btn-sm" onclick="App.updateGoalProgress('${g.id}')" style="padding: 5px 15px;">
                                <i class="fas fa-plus"></i> İlerleme
                            </button>
                        ` : `
                            <span class="badge badge-success">✓ Tamamlandı</span>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    },

    showGoalModal() {
        const content = `
            <form id="goalForm">
                <div class="form-group">
                    <label>Hedef Başlığı *</label>
                    <input type="text" name="title" placeholder="örn: Bu ay 5 kitap okuyacağım" required>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="2" placeholder="Hedefini açıkla..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Hedef Tarihi</label>
                        <input type="date" name="targetDate" required>
                    </div>
                    <div class="form-group">
                        <label>Kategori</label>
                        <select name="category">
                            <option value="reading">📚 Kitap Okuma</option>
                            <option value="grade">📝 Not Hedefi</option>
                            <option value="attendance">✓ Devamsızlık</option>
                            <option value="homework">📋 Ödev</option>
                            <option value="other">⭐ Diğer</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: 'App.saveGoal()' }
        ];
        this.showModal('Yeni Hedef Belirle', content, buttons);
    },

    saveGoal() {
        const form = document.getElementById('goalForm');
        const formData = new FormData(form);

        if (!this.data.goals) this.data.goals = [];
        this.data.goals.push({
            id: this.generateId(),
            studentId: this.currentUser.role === 'student' ? this.currentUser.studentId : null,
            title: formData.get('title'),
            description: formData.get('description'),
            targetDate: formData.get('targetDate'),
            category: formData.get('category'),
            progress: 0,
            completed: false,
            createdAt: new Date().toISOString().split('T')[0]
        });

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Hedef eklendi! 🎯');
    },

    updateGoalProgress(goalId) {
        const goal = this.data.goals.find(g => g.id === goalId);
        if (goal) {
            goal.progress = Math.min(goal.progress + 10, 100);
            if (goal.progress >= 100) {
                goal.completed = true;
                this.showToast('🎉 Tebrikler! Hedef tamamlandı!');
            } else {
                this.showToast(`İlerleme: ${goal.progress}%`);
            }
            this.saveData();
            this.renderPage(this.currentPage);
        }
    },

    renderMyGoals() {
        const studentId = this.currentUser.studentId;
        const myGoals = (this.data.goals || []).filter(g => !g.studentId || g.studentId === studentId);
        const active = myGoals.filter(g => !g.completed);
        const completed = myGoals.filter(g => g.completed);

        return `
            <div class="page-header">
                <h1 class="page-title">🎯 Hedeflerim</h1>
                <button class="btn btn-primary" onclick="App.showGoalModal()">
                    <i class="fas fa-plus"></i> Yeni Hedef
                </button>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-bullseye"></i></div>
                    <div class="stat-info">
                        <h4>${active.length}</h4>
                        <p>Aktif Hedef</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <h4>${completed.length}</h4>
                        <p>Tamamlanan</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Aktif Hedeflerim</span>
                </div>
                ${active.length > 0 ? active.map(g => `
                    <div style="padding: 15px; border-bottom: 1px solid var(--gray-200);">
                        <div style="display: flex; justify-content: space-between;">
                            <div>
                                <strong>${g.title}</strong>
                                <p style="font-size: 12px; color: var(--gray-500);">${g.description || ''}</p>
                            </div>
                            <button class="btn btn-success" onclick="App.updateGoalProgress('${g.id}')" style="padding: 5px 15px;">
                                +10% İlerle
                            </button>
                        </div>
                        <div class="grade-progress" style="margin-top: 10px;">
                            <div class="grade-progress-bar">
                                <div class="grade-progress-fill ${g.progress >= 70 ? 'high' : 'medium'}" style="width: ${g.progress}%"></div>
                            </div>
                        </div>
                        <span style="font-size: 11px; color: var(--gray-500);">${g.progress}% - Hedef: ${g.targetDate}</span>
                    </div>
                `).join('') : '<p class="empty-state">Henüz aktif hedef yok</p>'}
            </div>

            ${completed.length > 0 ? `
                <div class="card" style="margin-top: 20px;">
                    <div class="card-header">
                        <span class="card-title">🏆 Tamamlanan Hedefler</span>
                    </div>
                    ${completed.map(g => `
                        <div style="padding: 15px; border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; gap: 15px;">
                            <span style="font-size: 30px;">🎉</span>
                            <div>
                                <strong style="text-decoration: line-through; color: var(--gray-500);">${g.title}</strong>
                                <p style="font-size: 12px; color: var(--gray-400);">${g.targetDate}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
    },

    renderLGSAnalysis() {
        const studentId = this.currentUser.studentId;
        const studentGrades = (this.data.grades || []).filter(g => g.studentId === studentId && g.examType === 'Deneme');
        
        const subjectAnalysis = {};
        studentGrades.forEach(g => {
            if (!subjectAnalysis[g.subject]) {
                subjectAnalysis[g.subject] = { scores: [], avg: 0 };
            }
            subjectAnalysis[g.subject].scores.push(parseFloat(g.score));
        });

        Object.keys(subjectAnalysis).forEach(subj => {
            const scores = subjectAnalysis[subj].scores;
            subjectAnalysis[subj].avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            subjectAnalysis[subj].trend = scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0;
        });

        const weakSubjects = Object.entries(subjectAnalysis)
            .filter(([_, data]) => data.avg < 50)
            .sort((a, b) => a[1].avg - b[1].avg);

        const strongSubjects = Object.entries(subjectAnalysis)
            .filter(([_, data]) => data.avg >= 70)
            .sort((a, b) => b[1].avg - a[1].avg);

        return `
            <div class="page-header">
                <h1 class="page-title">📊 LGS Analiz</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="stat-info">
                        <h4>${weakSubjects.length}</h4>
                        <p>Zayıf Konu</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <h4>${strongSubjects.length}</h4>
                        <p>Güçlü Konu</p>
                    </div>
                </div>
            </div>

            ${weakSubjects.length > 0 ? `
                <div class="card" style="margin-bottom: 20px; border-left: 4px solid #ef4444;">
                    <div class="card-header">
                        <span class="card-title" style="color: #ef4444;">⚠️ İyileştirilmesi Gereken Konular</span>
                    </div>
                    <div style="padding: 15px;">
                        ${weakSubjects.map(([subj, data]) => `
                            <div style="padding: 12px; background: #fef2f2; border-radius: var(--radius); margin-bottom: 10px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <strong>${subj}</strong>
                                    <span class="badge badge-danger">${data.avg.toFixed(1)} ort.</span>
                                </div>
                                <p style="font-size: 13px; color: var(--gray-600);">Bu konuda daha fazla soru çözmen önerilir.</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${strongSubjects.length > 0 ? `
                <div class="card" style="margin-bottom: 20px; border-left: 4px solid #10b981;">
                    <div class="card-header">
                        <span class="card-title" style="color: #10b981;">💪 Güçlü Olduğun Konular</span>
                    </div>
                    <div style="padding: 15px;">
                        ${strongSubjects.map(([subj, data]) => `
                            <div style="padding: 12px; background: #f0fdf4; border-radius: var(--radius); margin-bottom: 10px;">
                                <div style="display: flex; justify-content: space-between;">
                                    <strong>${subj}</strong>
                                    <span class="badge badge-success">${data.avg.toFixed(1)} ort.</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="card">
                <div class="card-header">
                    <span class="card-title">📈 Tüm Derslerin Analizi</span>
                </div>
                <div style="padding: 15px;">
                    ${Object.entries(subjectAnalysis).map(([subj, data]) => `
                        <div style="margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <strong>${subj}</strong>
                                <span>${data.avg.toFixed(1)}</span>
                            </div>
                            <div class="grade-progress">
                                <div class="grade-progress-bar">
                                    <div class="grade-progress-fill ${data.avg >= 70 ? 'high' : data.avg >= 50 ? 'medium' : 'low'}" style="width: ${data.avg}%"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    ${Object.keys(subjectAnalysis).length === 0 ? '<p class="empty-state">Deneme sınavı notu girilmemiş</p>' : ''}
                </div>
            </div>
        `;
    },

    renderRewards() {
        const rewards = this.data.rewards || [
            { id: '1', name: 'Kantin İndirimi %10', cost: 20, icon: 'fa-coffee' },
            { id: '2', name: 'Serbest Kıyafet Günü', cost: 30, icon: 'fa-tshirt' },
            { id: '3', name: 'Öğretmen Seçimi Hakkı', cost: 50, icon: 'fa-user-astronaut' },
            { id: '4', name: 'Bir Gün Geç Kalma Hakkı', cost: 15, icon: 'fa-clock' },
            { id: '5', name: 'Partide Öncelik', cost: 40, icon: 'fa-birthday-cake' }
        ];
        this.data.rewards = rewards;

        return `
            <div class="page-header">
                <h1 class="page-title">🎁 Ödül Marketi</h1>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Kullanılabilir Ödüller</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; padding: 15px;">
                    ${rewards.map(r => `
                        <div style="text-align: center; padding: 20px; background: var(--gray-100); border-radius: var(--radius);">
                            <div style="width: 60px; height: 60px; background: var(--primary); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas ${r.icon}" style="color: white; font-size: 24px;"></i>
                            </div>
                            <h4 style="font-size: 14px; margin-bottom: 5px;">${r.name}</h4>
                            <p style="font-size: 18px; color: #fbbf24; margin-bottom: 10px;">⭐ ${r.cost}</p>
                            <button class="btn btn-secondary btn-sm" onclick="App.redeemReward('${r.id}')">
                                Almak İstiyorum
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    redeemReward(rewardId) {
        const reward = this.data.rewards.find(r => r.id === rewardId);
        if (!reward) return;

        const studentId = this.currentUser.studentId;
        const totalStars = (this.data.starPoints || []).filter(p => p.studentId === studentId).reduce((a, p) => a + p.points, 0);

        if (totalStars < reward.cost) {
            this.showToast(`Yeterli yıldız puanın yok! (Gerekli: ${reward.cost}, Mevcut: ${totalStars})`, 'error');
            return;
        }

        if (confirm(`${reward.name} ödülünü ${reward.cost} yıldız karşılığında almak istiyor musun?`)) {
            this.showToast(`${reward.name} ödülünü aldın! 🎉 Ödülünü öğretmenine göster.`, 'success');
        }
    },

    renderTrialResults() {
        const exams = this.data.trialExams || [];
        const allResults = this.data.trialResults || [];
        
        return `
            <div class="page-header">
                <h1 class="page-title">📊 Deneme Sonuçları Yönetimi</h1>
                <button class="btn btn-primary" onclick="App.showTrialExamModal()">
                    <i class="fas fa-plus"></i> Yeni Deneme Ekle
                </button>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title">Deneme Listesi</span>
                </div>
                ${exams.length > 0 ? exams.map(exam => this.renderTrialExamCard(exam, allResults)).join('') : '<p class="empty-state">Henüz deneme eklenmedi. Yeni deneme ekleyerek başlayın.</p>'}
            </div>
        `;
    },

    renderTrialExamCard(exam, allResults) {
        const examResults = allResults.filter(r => r.examId === exam.id);
        const date = new Date(exam.date);
        
        return `
            <div class="exam-card" style="margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="exam-date">
                        <div class="day">${date.getDate()}</div>
                        <div class="month">${['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][date.getMonth()]}</div>
                    </div>
                    <div class="exam-info" style="flex: 1;">
                        <h4>${exam.name}</h4>
                        <p>${exam.subjects.join(', ')}</p>
                        <p style="font-size: 12px; color: var(--gray-500);">${examResults.length} öğrenci sonuç girdi</p>
                    </div>
                    <div class="action-btns">
                        <button class="action-btn view" onclick="App.viewTrialExamResults('${exam.id}')" title="Sonuçları Gör">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="action-btn edit" onclick="App.showTrialExamResultsModal('${exam.id}')" title="Sonuç Gir">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="App.deleteTrialExam('${exam.id}')" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    showTrialExamModal() {
        const subjects = ['Türkçe', 'Matematik', 'Fen', 'Sosyal', 'İngilizce', 'Din Kültürü'];
        
        const content = `
            <form id="trialExamForm">
                <div class="form-group">
                    <label>Deneme Adı *</label>
                    <input type="text" name="name" placeholder="örn: 1. Deneme Sınavı" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tarih *</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Toplam Soru</label>
                        <input type="number" name="totalQuestions" value="100" min="1">
                    </div>
                </div>
                <div class="form-group">
                    <label>Dersler (Ctrl ile seç)</label>
                    <select name="subjects" multiple style="height: 120px;">
                        ${subjects.map(s => `<option value="${s}" selected>${s}</option>`).join('')}
                    </select>
                </div>
            </form>
        `;
        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: 'App.saveTrialExam()' }
        ];
        this.showModal('Yeni Deneme', content, buttons);
    },

    saveTrialExam() {
        const form = document.getElementById('trialExamForm');
        const formData = new FormData(form);
        
        const subjects = [];
        const select = form.querySelector('[name="subjects"]');
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].selected) {
                subjects.push(select.options[i].value);
            }
        }

        if (!this.data.trialExams) this.data.trialExams = [];
        
        this.data.trialExams.push({
            id: this.generateId(),
            name: formData.get('name'),
            date: formData.get('date'),
            totalQuestions: parseInt(formData.get('totalQuestions')) || 100,
            subjects: subjects,
            createdBy: this.currentUser.name
        });

        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Deneme eklendi!');
    },

    deleteTrialExam(examId) {
        if (confirm('Bu denemeyi ve tüm sonuçlarını silmek istediğinize emin misiniz?')) {
            this.data.trialExams = (this.data.trialExams || []).filter(e => e.id !== examId);
            this.data.trialResults = (this.data.trialResults || []).filter(r => r.examId !== examId);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Deneme silindi!');
        }
    },

    showTrialExamResultsModal(examId) {
        const exam = this.data.trialExams.find(e => e.id === examId);
        if (!exam) return;

        const students = this.data.students;
        
        let html = `<div style="max-height: 400px; overflow-y: auto;">
            <p style="margin-bottom: 15px; color: var(--gray-500);">${exam.name} - Sonuç Girişi</p>
            <form id="trialResultsForm">
                <input type="hidden" name="examId" value="${examId}">
                <div class="form-group">
                    <label>Öğrenci Seç *</label>
                    <select name="studentId" required onchange="App.loadStudentTrialResult('${examId}')">
                        <option value="">Seçin...</option>
                        ${students.map(s => `<option value="${s.id}">${s.name} (${s.number})</option>`).join('')}
                    </select>
                </div>`;
        
        exam.subjects.forEach(subject => {
            html += `
                <div class="form-row">
                    <div class="form-group">
                        <label>${subject} Doğru</label>
                        <input type="number" name="correct_${subject.replace(/ /g, '_')}" min="0" placeholder="Doğru">
                    </div>
                    <div class="form-group">
                        <label>${subject} Yanlış</label>
                        <input type="number" name="wrong_${subject.replace(/ /g, '_')}" min="0" placeholder="Yanlış">
                    </div>
                </div>
            `;
        });

        html += `
                <div class="form-row">
                    <div class="form-group">
                        <label>Sınıf Sıralaması</label>
                        <input type="number" name="classRank" placeholder="Sınıf sırası">
                    </div>
                    <div class="form-group">
                        <label>Okul Sıralaması</label>
                        <input type="number" name="schoolRank" placeholder="Okul sırası">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Sınıf Mevcudu</label>
                        <input type="number" name="classSize" placeholder="Sınıf mevcudu">
                    </div>
                    <div class="form-group">
                        <label>Okul Mevcudu</label>
                        <input type="number" name="schoolSize" placeholder="Okul mevcudu">
                    </div>
                </div>
            </form>
        </div>`;

        const buttons = [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: `App.saveTrialResult('${examId}')` }
        ];
        this.showModal('Deneme Sonuç Girişi', html, buttons);
    },

    loadStudentTrialResult(examId) {
        const form = document.getElementById('trialResultsForm');
        const studentId = form.querySelector('[name="studentId"]').value;
        const exam = this.data.trialExams.find(e => e.id === examId);
        
        const existingResult = (this.data.trialResults || []).find(r => r.examId === examId && r.studentId === studentId);
        
        if (existingResult) {
            exam.subjects.forEach(subject => {
                const correctInput = form.querySelector(`[name="correct_${subject.replace(/ /g, '_')}"]`);
                const wrongInput = form.querySelector(`[name="wrong_${subject.replace(/ /g, '_')}"]`);
                if (correctInput && existingResult.subjects[subject]) {
                    correctInput.value = existingResult.subjects[subject].correct || '';
                    wrongInput.value = existingResult.subjects[subject].wrong || '';
                }
            });
            form.querySelector('[name="classRank"]').value = existingResult.classRank || '';
            form.querySelector('[name="schoolRank"]').value = existingResult.schoolRank || '';
            form.querySelector('[name="classSize"]').value = existingResult.classSize || '';
            form.querySelector('[name="schoolSize"]').value = existingResult.schoolSize || '';
        }
    },

    saveTrialResult(examId) {
        const form = document.getElementById('trialResultsForm');
        const formData = new FormData(form);
        const exam = this.data.trialExams.find(e => e.id === examId);
        
        const studentId = formData.get('studentId');
        if (!studentId) {
            this.showToast('Lütfen öğrenci seçin!', 'error');
            return;
        }

        const subjects = {};
        let totalCorrect = 0;
        let totalWrong = 0;
        
        exam.subjects.forEach(subject => {
            const correct = parseInt(formData.get(`correct_${subject.replace(/ /g, '_')}`)) || 0;
            const wrong = parseInt(formData.get(`wrong_${subject.replace(/ /g, '_')}`)) || 0;
            subjects[subject] = { correct, wrong };
            totalCorrect += correct;
            totalWrong += wrong;
        });

        const totalNet = totalCorrect - (totalWrong / 4);
        const totalQuestions = exam.totalQuestions || 100;
        const netPercent = ((totalNet / totalQuestions) * 100).toFixed(1);

        const resultData = {
            examId,
            studentId,
            subjects,
            totalCorrect,
            totalWrong,
            totalNet: Math.max(0, totalNet),
            totalPercent: netPercent,
            classRank: parseInt(formData.get('classRank')) || null,
            schoolRank: parseInt(formData.get('schoolRank')) || null,
            classSize: parseInt(formData.get('classSize')) || null,
            schoolSize: parseInt(formData.get('schoolSize')) || null,
            date: exam.date
        };

        if (!this.data.trialResults) this.data.trialResults = [];
        
        const existingIndex = this.data.trialResults.findIndex(r => r.examId === examId && r.studentId === studentId);
        if (existingIndex >= 0) {
            this.data.trialResults[existingIndex] = { ...this.data.trialResults[existingIndex], ...resultData };
        } else {
            this.data.trialResults.push(resultData);
        }

        this.saveData();
        this.closeModal();
        this.showToast('Sonuç kaydedildi!');
    },

    viewTrialExamResults(examId) {
        const exam = this.data.trialExams.find(e => e.id === examId);
        if (!exam) return;

        const results = (this.data.trialResults || []).filter(r => r.examId === examId);
        
        const resultsWithStudents = results.map(r => {
            const student = this.data.students.find(s => s.id === r.studentId);
            return { ...r, student };
        }).sort((a, b) => (b.totalNet || 0) - (a.totalNet || 0));

        const content = `
            <div style="max-height: 500px; overflow-y: auto;">
                <h3 style="margin-bottom: 15px;">${exam.name}</h3>
                <p style="color: var(--gray-500); margin-bottom: 20px;">Tarih: ${exam.date} | Dersler: ${exam.subjects.join(', ')}</p>
                
                <table style="width: 100%; font-size: 13px;">
                    <thead>
                        <tr style="background: var(--gray-100);">
                            <th>Öğrenci</th>
                            <th>Net</th>
                            <th>%</th>
                            <th>Sınıf Sıra</th>
                            <th>Okul Sıra</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${resultsWithStudents.map((r, i) => `
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="font-weight: bold; color: ${i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : 'inherit'}">#${i + 1}</span>
                                        <div class="student-avatar" style="width: 28px; height: 28px; font-size: 11px;">${r.student?.name?.charAt(0) || '?'}</div>
                                        ${r.student?.name || 'Bilinmiyor'}
                                    </div>
                                </td>
                                <td><strong>${(r.totalNet || 0).toFixed(1)}</strong></td>
                                <td>${r.totalPercent || 0}%</td>
                                <td>${r.classRank ? `${r.classRank}/${r.classSize || '-'}` : '-'}</td>
                                <td>${r.schoolRank ? `${r.schoolRank}/${r.schoolSize || '-'}` : '-'}</td>
                                <td>
                                    <button class="action-btn view" onclick="App.viewStudentTrialDetail('${examId}', '${r.studentId}')" title="Detay">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${resultsWithStudents.length === 0 ? '<p class="empty-state">Henüz sonuç girilmedi</p>' : ''}
            </div>
        `;
        
        this.showModal('Deneme Sonuçları', content, [
            { text: 'Kapat', action: 'App.closeModal()' }
        ]);
    },

    viewStudentTrialDetail(examId, studentId) {
        const exam = this.data.trialExams.find(e => e.id === examId);
        const result = (this.data.trialResults || []).find(r => r.examId === examId && r.studentId === studentId);
        const student = this.data.students.find(s => s.id === studentId);

        let html = `<h3 style="margin-bottom: 15px;">${student?.name || 'Öğrenci'}</h3>`;
        
        exam.subjects.forEach(subject => {
            const data = result.subjects[subject] || { correct: 0, wrong: 0 };
            const net = data.correct - (data.wrong / 4);
            html += `
                <div style="padding: 12px; background: var(--gray-100); border-radius: var(--radius); margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; font-weight: 600;">
                        <span>${subject}</span>
                        <span>Net: ${net.toFixed(1)}</span>
                    </div>
                    <div style="font-size: 13px; color: var(--gray-500); margin-top: 5px;">
                        Doğru: ${data.correct} | Yanlış: ${data.wrong}
                    </div>
                </div>
            `;
        });

        html += `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                <div style="padding: 15px; background: #dbeafe; border-radius: var(--radius); text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: var(--info);">#${result.classRank || '-'}</div>
                    <div style="font-size: 12px; color: var(--gray-500);">Sınıf Sıralaması</div>
                </div>
                <div style="padding: 15px; background: #f3e8ff; border-radius: var(--radius); text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #a855f7;">#${result.schoolRank || '-'}</div>
                    <div style="font-size: 12px; color: var(--gray-500);">Okul Sıralaması</div>
                </div>
            </div>
        `;

        this.showModal('Öğrenci Sonuç Detayı', html, [{ text: 'Kapat', action: 'App.closeModal()' }]);
    },

    renderMyTrialResults() {
        const studentId = this.currentUser.studentId;
        const myResults = (this.data.trialResults || []).filter(r => r.studentId === studentId);
        
        const resultsWithExams = myResults.map(r => {
            const exam = this.data.trialExams.find(e => e.id === r.examId);
            return { ...r, exam };
        }).filter(r => r.exam).sort((a, b) => new Date(b.exam.date) - new Date(a.exam.date));

        return `
            <div class="page-header">
                <h1 class="page-title">📊 Deneme Sonuçlarım</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-file-alt"></i></div>
                    <div class="stat-info">
                        <h4>${resultsWithExams.length}</h4>
                        <p>Girilen Deneme</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-arrow-up"></i></div>
                    <div class="stat-info">
                        <h4>${resultsWithExams.length > 0 ? (resultsWithExams[0]?.totalNet || 0).toFixed(1) : '-'}</h4>
                        <p>Son Net</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Deneme Sonuçlarım</span>
                </div>
                ${resultsWithExams.length > 0 ? resultsWithExams.map(r => `
                    <div style="padding: 20px; border-bottom: 1px solid var(--gray-200);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div>
                                <h4>${r.exam.name}</h4>
                                <p style="font-size: 13px; color: var(--gray-500);">${r.exam.date}</p>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 28px; font-weight: bold; color: var(--primary);">${(r.totalNet || 0).toFixed(1)}</div>
                                <div style="font-size: 13px; color: var(--gray-500);">NET</div>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">
                            <div style="padding: 12px; background: var(--gray-100); border-radius: var(--radius); text-align: center;">
                                <div style="font-size: 18px; font-weight: bold;">${r.totalPercent || 0}%</div>
                                <div style="font-size: 11px; color: var(--gray-500);">Başarı</div>
                            </div>
                            <div style="padding: 12px; background: #dbeafe; border-radius: var(--radius); text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: var(--info);">#${r.classRank || '-'}</div>
                                <div style="font-size: 11px; color: var(--gray-500);">Sınıf Sırası</div>
                            </div>
                            <div style="padding: 12px; background: #f3e8ff; border-radius: var(--radius); text-align: center;">
                                <div style="font-size: 18px; font-weight: bold; color: #a855f7;">#${r.schoolRank || '-'}</div>
                                <div style="font-size: 11px; color: var(--gray-500);">Okul Sırası</div>
                            </div>
                        </div>

                        <details style="margin-top: 10px;">
                            <summary style="cursor: pointer; color: var(--primary); font-size: 14px;">Ders Bazlı Detay</summary>
                            <div style="margin-top: 10px; padding: 10px; background: var(--gray-100); border-radius: var(--radius);">
                                ${Object.entries(r.subjects || {}).map(([subject, data]) => {
                                    const net = (data.correct || 0) - ((data.wrong || 0) / 4);
                                    return `
                                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--gray-200);">
                                            <span>${subject}</span>
                                            <span><strong>${net.toFixed(1)} net</strong> (D: ${data.correct}, Y: ${data.wrong})</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </details>
                    </div>
                `).join('') : '<p class="empty-state">Henüz deneme sonucu girilmedi</p>'}
            </div>
        `;
    },

    showNotifications() {
        this.navigate('notifications');
    },

    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        const notifications = (this.data.notifications || []).filter(n => !n.read && n.userId === this.currentUser?.id);
        if (badge) {
            if (notifications.length > 0) {
                badge.textContent = notifications.length;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    renderNotifications() {
        const myNotifications = (this.data.notifications || [])
            .filter(n => !n.userId || n.userId === this.currentUser?.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        return `
            <div class="page-header">
                <h1 class="page-title">🔔 Bildirimlerim</h1>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Tüm Bildirimler</span>
                    <button class="btn btn-secondary" onclick="App.markAllNotificationsRead()">
                        Tümünü Okundu İşaretle
                    </button>
                </div>
                ${myNotifications.length > 0 ? myNotifications.map(n => `
                    <div style="padding: 15px; border-bottom: 1px solid var(--gray-200); ${n.read ? 'opacity: 0.6;' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; margin-bottom: 5px;">${n.title}</div>
                                <p style="color: var(--gray-500); font-size: 14px;">${n.message}</p>
                                <div style="font-size: 12px; color: var(--gray-400); margin-top: 5px;">${n.date} ${n.time || ''}</div>
                            </div>
                            ${!n.read ? '<span style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%;"></span>' : ''}
                        </div>
                    </div>
                `).join('') : '<p class="empty-state">Henüz bildirim yok</p>'}
            </div>
        `;
    },

    markAllNotificationsRead() {
        if (!this.data.notifications) this.data.notifications = [];
        this.data.notifications.forEach(n => {
            if (!n.userId || n.userId === this.currentUser?.id) {
                n.read = true;
            }
        });
        this.saveData();
        this.updateNotificationBadge();
        this.renderPage(this.currentPage);
        this.showToast('Tüm bildirimler okundu olarak işaretlendi');
    },

    addNotification(title, message, userId = null) {
        if (!this.data.notifications) this.data.notifications = [];
        this.data.notifications.push({
            id: this.generateId(),
            title,
            message,
            userId,
            read: false,
            date: new Date().toLocaleDateString('tr-TR'),
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        });
        this.saveData();
        this.updateNotificationBadge();
    },

    renderMessages() {
        const messages = (this.data.messages || []).sort((a, b) => new Date(b.date) - new Date(a.date));

        return `
            <div class="page-header">
                <h1 class="page-title">💬 Mesajlar</h1>
                <button class="btn btn-primary" onclick="App.showNewMessageModal()">
                    <i class="fas fa-plus"></i> Yeni Mesaj
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Tüm Mesajlar</span>
                </div>
                ${messages.length > 0 ? messages.map(m => this.renderMessageCard(m)).join('') : '<p class="empty-state">Henüz mesaj yok. İlk mesajı siz gönderin!</p>'}
            </div>
        `;
    },

    renderMessageCard(m) {
        const isNew = !m.read;
        return `
            <div style="padding: 20px; border-bottom: 1px solid var(--gray-200); cursor: pointer; ${isNew ? 'background: #f0f9ff;' : ''}" onclick="App.viewMessage('${m.id}')">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="student-avatar" style="background: ${this.getRoleColor(m.senderRole)};">${m.senderName?.charAt(0) || '?'}</div>
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between;">
                            <strong>${m.senderName}</strong>
                            <span style="font-size: 12px; color: var(--gray-500);">${m.date}</span>
                        </div>
                        <div style="color: var(--gray-500); font-size: 14px; margin-top: 3px;">${m.subject}</div>
                        <p style="color: var(--gray-400); font-size: 13px; margin-top: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.content}</p>
                    </div>
                    ${isNew ? '<span style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%;"></span>' : ''}
                </div>
            </div>
        `;
    },

    getRoleColor(role) {
        const colors = { admin: '#ef4444', teacher: '#3b82f6', student: '#10b981', parent: '#f59e0b' };
        return colors[role] || '#6b7280';
    },

    showNewMessageModal() {
        const content = `
            <form id="messageForm">
                <div class="form-group">
                    <label>Alıcı</label>
                    <select name="recipient">
                        <option value="all">Tüm Sınıf</option>
                        <option value="teachers">Öğretmenler</option>
                        <option value="students">Öğrenciler</option>
                        <option value="parents">Veliler</option>
                        ${this.currentUser.role === 'admin' ? '<option value="admin">Admin</option>' : ''}
                    </select>
                </div>
                <div class="form-group">
                    <label>Konu *</label>
                    <input type="text" name="subject" required placeholder="Mesaj konusu">
                </div>
                <div class="form-group">
                    <label>Mesaj *</label>
                    <textarea name="content" rows="5" required placeholder="Mesajınızı yazın..."></textarea>
                </div>
            </form>
        `;
        this.showModal('Yeni Mesaj', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Gönder', class: 'btn-primary', action: 'App.sendMessage()' }
        ]);
    },

    sendMessage() {
        const form = document.getElementById('messageForm');
        const formData = new FormData(form);

        if (!this.data.messages) this.data.messages = [];

        this.data.messages.push({
            id: this.generateId(),
            senderId: this.currentUser.id,
            senderName: this.currentUser.name,
            senderRole: this.currentUser.role,
            recipient: formData.get('recipient'),
            subject: formData.get('subject'),
            content: formData.get('content'),
            date: new Date().toLocaleDateString('tr-TR'),
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            read: false
        });

        this.saveData();
        this.closeModal();
        this.showToast('Mesaj gönderildi!');
        this.renderPage(this.currentPage);
    },

    viewMessage(id) {
        const message = this.data.messages.find(m => m.id === id);
        if (message) {
            message.read = true;
            this.saveData();
        }

        const content = `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div class="student-avatar" style="background: ${this.getRoleColor(message?.senderRole)}; width: 50px; height: 50px; font-size: 20px;">
                        ${message?.senderName?.charAt(0) || '?'}
                    </div>
                    <div>
                        <strong>${message?.senderName}</strong>
                        <div style="font-size: 12px; color: var(--gray-500);">${message?.date} ${message?.time}</div>
                    </div>
                </div>
                <h4 style="margin-bottom: 10px;">${message?.subject}</h4>
                <p style="line-height: 1.8; white-space: pre-wrap;">${message?.content}</p>
            </div>
        `;

        const buttons = [
            { text: 'Kapat', action: 'App.closeModal()' },
            { text: 'Yanıtla', class: 'btn-primary', action: `App.replyToMessage('${id}')` }
        ];
        this.showModal('Mesaj', content, buttons);
        this.updateNotificationBadge();
    },

    replyToMessage(id) {
        const message = this.data.messages.find(m => m.id === id);
        if (message) {
            this.closeModal();
            this.showNewMessageModal();
            setTimeout(() => {
                document.querySelector('[name="subject"]').value = 'Yanıt: ' + message.subject;
            }, 100);
        }
    },

    renderMyMessages() {
        return this.renderMessages();
    },

    renderFiles() {
        const files = (this.data.files || []).sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        return `
            <div class="page-header">
                <h1 class="page-title">📁 Dosya Yönetimi</h1>
                <button class="btn btn-primary" onclick="App.showUploadModal()">
                    <i class="fas fa-upload"></i> Dosya Yükle
                </button>
            </div>

            <div class="search-filter" style="margin-bottom: 20px;">
                <input type="text" id="fileSearch" placeholder="Dosya ara..." oninput="App.filterFiles()">
                <select id="fileType" onchange="App.filterFiles()">
                    <option value="">Tüm Dosyalar</option>
                    <option value="homework">Ödev</option>
                    <option value="material">Ders Materyali</option>
                    <option value="exam">Sınav</option>
                    <option value="other">Diğer</option>
                </select>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Yüklenen Dosyalar</span>
                </div>
                <div id="filesList">
                    ${this.renderFilesList(files)}
                </div>
            </div>
        `;
    },

    renderFilesList(files) {
        if (files.length === 0) {
            return '<p class="empty-state">Henüz dosya yüklenmedi</p>';
        }

        return files.map(f => `
            <div style="padding: 15px; border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; gap: 15px;">
                <div style="width: 50px; height: 50px; background: ${this.getFileColor(f.type)}; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: white;">
                    <i class="fas ${this.getFileIcon(f.type)}"></i>
                </div>
                <div style="flex: 1;">
                    <strong>${f.name}</strong>
                    <div style="font-size: 12px; color: var(--gray-500);">
                        ${f.type} | ${f.size || 'Boyut belirtilmedi'} | ${f.uploadDate} | ${f.uploadedBy}
                    </div>
                </div>
                <div class="action-btns">
                    <button class="action-btn view" onclick="App.downloadFile('${f.id}')" title="İndir">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn delete" onclick="App.deleteFile('${f.id}')" title="Sil">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    getFileColor(type) {
        const colors = { homework: '#10b981', material: '#3b82f6', exam: '#ef4444', other: '#6b7280' };
        return colors[type] || '#6b7280';
    },

    getFileIcon(type) {
        const icons = { homework: 'fa-tasks', material: 'fa-book', exam: 'fa-file-alt', other: 'fa-file' };
        return icons[type] || 'fa-file';
    },

    showUploadModal() {
        const content = `
            <form id="uploadForm">
                <div class="form-group">
                    <label>Dosya Adı *</label>
                    <input type="text" name="name" required placeholder="Dosya adı">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tür</label>
                        <select name="type">
                            <option value="homework">Ödev</option>
                            <option value="material">Ders Materyali</option>
                            <option value="exam">Sınav</option>
                            <option value="other">Diğer</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ders</label>
                        <input type="text" name="subject" placeholder="örn: Matematik">
                    </div>
                </div>
                <div class="form-group">
                    <label>Not / Açıklama</label>
                    <textarea name="description" rows="2" placeholder="Dosya hakkında not..."></textarea>
                </div>
                <div class="file-upload-area" onclick="document.getElementById('fileInput').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Dosya seçmek için tıklayın</p>
                    <input type="file" id="fileInput" style="display: none;" onchange="App.handleFileSelect(this)">
                </div>
                <p id="selectedFileName" style="text-align: center; margin-top: 10px; color: var(--gray-500);"></p>
            </form>
        `;
        this.showModal('Dosya Yükle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Yükle', class: 'btn-primary', action: 'App.uploadFile()' }
        ]);
    },

    handleFileSelect(input) {
        const file = input.files[0];
        if (file) {
            document.getElementById('selectedFileName').textContent = file.name;
            this.selectedFile = file;
        }
    },

    uploadFile() {
        const form = document.getElementById('uploadForm');
        const formData = new FormData(form);

        if (!this.data.files) this.data.files = [];

        const fileData = {
            id: this.generateId(),
            name: formData.get('name'),
            type: formData.get('type'),
            subject: formData.get('subject'),
            description: formData.get('description'),
            uploadDate: new Date().toLocaleDateString('tr-TR'),
            uploadedBy: this.currentUser.name,
            fileName: this.selectedFile?.name || formData.get('name'),
            size: this.selectedFile ? (this.selectedFile.size / 1024).toFixed(1) + ' KB' : 'Boyut belirtilmedi'
        };

        this.data.files.push(fileData);
        this.saveData();
        this.closeModal();
        this.selectedFile = null;
        this.showToast('Dosya yüklendi!');
        this.renderPage(this.currentPage);
    },

    downloadFile(id) {
        const file = this.data.files.find(f => f.id === id);
        if (file) {
            this.showToast(`${file.name} indirildi (simülasyon)`);
        }
    },

    deleteFile(id) {
        if (confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
            this.data.files = (this.data.files || []).filter(f => f.id !== id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Dosya silindi!');
        }
    },

    filterFiles() {
        const search = document.getElementById('fileSearch')?.value.toLowerCase() || '';
        const type = document.getElementById('fileType')?.value || '';
        
        let files = (this.data.files || []);
        if (search) {
            files = files.filter(f => f.name.toLowerCase().includes(search) || f.subject?.toLowerCase().includes(search));
        }
        if (type) {
            files = files.filter(f => f.type === type);
        }

        document.getElementById('filesList').innerHTML = this.renderFilesList(files);
    },

    renderMyFiles() {
        return this.renderFiles();
    },

    renderReport() {
        return `
            <div class="page-header">
                <h1 class="page-title">📄 Karne ve Raporlar</h1>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Öğrenci Karnesi</span>
                    </div>
                    <div style="padding: 20px;">
                        <p style="margin-bottom: 15px; color: var(--gray-500);">Öğrencinin dönem notlarını ve devamsızlık bilgilerini içeren karne oluştur.</p>
                        <div class="form-group">
                            <label>Öğrenci Seç</label>
                            <select id="reportStudent">
                                <option value="">Seçin...</option>
                                ${this.data.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <button class="btn btn-primary" onclick="App.generateReport()" style="width: 100%;">
                            <i class="fas fa-file-pdf"></i> Karneni Oluştur
                        </button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Sınıf Karnesi</span>
                    </div>
                    <div style="padding: 20px;">
                        <p style="margin-bottom: 15px; color: var(--gray-500);">Tüm sınıfın dönem sonu karnesini oluştur.</p>
                        <button class="btn btn-primary" onclick="App.generateClassReport()" style="width: 100%;">
                            <i class="fas fa-users"></i> Sınıf Karnesini Oluştur
                        </button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Devamsızlık Raporu</span>
                    </div>
                    <div style="padding: 20px;">
                        <p style="margin-bottom: 15px; color: var(--gray-500);">Öğrencinin devamsızlık raporunu oluştur.</p>
                        <div class="form-group">
                            <label>Öğrenci Seç</label>
                            <select id="attendanceStudent">
                                <option value="">Seçin...</option>
                                ${this.data.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <button class="btn btn-primary" onclick="App.generateAttendanceReport()" style="width: 100%;">
                            <i class="fas fa-clipboard-list"></i> Rapor Oluştur
                        </button>
                    </div>
                </div>
            </div>

            <div id="reportPreview" style="margin-top: 30px;"></div>
        `;
    },

    generateReport() {
        const studentId = document.getElementById('reportStudent')?.value;
        if (!studentId) {
            this.showToast('Lütfen öğrenci seçin!', 'error');
            return;
        }

        const student = this.data.students.find(s => s.id === studentId);
        const grades = (this.data.grades || []).filter(g => g.studentId === studentId);
        const attendance = (this.data.attendance || []).filter(a => a.studentId === studentId);
        
        const avgGrade = grades.length > 0 
            ? (grades.reduce((a, g) => a + parseFloat(g.score), 0) / grades.length).toFixed(1) 
            : '-';
        
        const subjects = [...new Set(grades.map(g => g.subject))];
        
        const reportHtml = `
            <div class="card" style="max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; padding: 30px; border-bottom: 2px solid var(--gray-200);">
                    <h1 style="color: var(--primary);">${this.data.settings.className || 'Sınıf'} Öğrenci Karnesi</h1>
                    <p style="color: var(--gray-500);">${this.data.settings.schoolYear || '2025-2026'} - ${this.data.settings.term || '1'}. Dönem</p>
                </div>
                
                <div style="padding: 30px;">
                    <div style="display: flex; gap: 30px; margin-bottom: 30px;">
                        <div>
                            <h3 style="margin-bottom: 5px;">${student?.name || 'Öğrenci'}</h3>
                            <p style="color: var(--gray-500);">No: ${student?.number || '-'}</p>
                            <p style="color: var(--gray-500);">Sınıf: ${this.data.settings.className || '-'}</p>
                        </div>
                        <div style="margin-left: auto; text-align: right;">
                            <div style="font-size: 48px; font-weight: bold; color: ${avgGrade >= 50 ? '#10b981' : '#ef4444'};">${avgGrade}</div>
                            <p style="color: var(--gray-500);">Ortalama</p>
                        </div>
                    </div>

                    <h4 style="margin-bottom: 15px;">Ders Notları</h4>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead>
                            <tr style="background: var(--gray-100);">
                                <th style="padding: 12px; text-align: left;">Ders</th>
                                <th style="padding: 12px; text-align: center;">Yazılı</th>
                                <th style="padding: 12px; text-align: center;">Sözlü</th>
                                <th style="padding: 12px; text-align: center;">Ortalama</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subjects.map(subj => {
                                const subjGrades = grades.filter(g => g.subject === subj);
                                const avg = (subjGrades.reduce((a, g) => a + parseFloat(g.score), 0) / subjGrades.length).toFixed(1);
                                const yazili = subjGrades.filter(g => g.examType === 'Yazılı');
                                const sozlu = subjGrades.filter(g => g.examType === 'Sözlü');
                                const yaziliAvg = yazili.length > 0 ? (yazili.reduce((a, g) => a + parseFloat(g.score), 0) / yazili.length).toFixed(1) : '-';
                                const sozluAvg = sozlu.length > 0 ? (sozlu.reduce((a, g) => a + parseFloat(g.score), 0) / sozlu.length).toFixed(1) : '-';
                                return `
                                    <tr style="border-bottom: 1px solid var(--gray-200);">
                                        <td style="padding: 12px;">${subj}</td>
                                        <td style="padding: 12px; text-align: center;">${yaziliAvg}</td>
                                        <td style="padding: 12px; text-align: center;">${sozluAvg}</td>
                                        <td style="padding: 12px; text-align: center; font-weight: bold;">${avg}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <h4 style="margin-bottom: 15px;">Devamsızlık Bilgileri</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                        <div style="padding: 20px; background: #d1fae5; border-radius: var(--radius); text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #065f46;">${attendance.filter(a => a.status === 'present').length}</div>
                            <div style="color: #065f46;">Devamsız Gün</div>
                        </div>
                        <div style="padding: 20px; background: #fee2e2; border-radius: var(--radius); text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #991b1b;">${attendance.filter(a => a.status === 'absent').length}</div>
                            <div style="color: #991b1b;">Devamsız Gün</div>
                        </div>
                        <div style="padding: 20px; background: #ffedd5; border-radius: var(--radius); text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #92400e;">${attendance.filter(a => a.status === 'late').length}</div>
                            <div style="color: #92400e;">Geç Kalan</div>
                        </div>
                    </div>
                </div>

                <div style="padding: 20px; border-top: 1px solid var(--gray-200); text-align: center; color: var(--gray-500); font-size: 12px;">
                    Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}
                </div>
            </div>
        `;

        document.getElementById('reportPreview').innerHTML = reportHtml;
    },

    generateClassReport() {
        const reportHtml = `
            <div class="card" style="max-width: 1000px; margin: 0 auto;">
                <div style="text-align: center; padding: 30px; border-bottom: 2px solid var(--gray-200);">
                    <h1 style="color: var(--primary);">${this.data.settings.className || 'Sınıf'} Sınıf Karnesi</h1>
                    <p style="color: var(--gray-500);">${this.data.settings.schoolYear || '2025-2026'} - ${this.data.settings.term || '1'}. Dönem</p>
                </div>
                
                <div style="padding: 30px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: var(--primary); color: white;">
                                <th style="padding: 12px; text-align: left;">No</th>
                                <th style="padding: 12px; text-align: left;">Ad Soyad</th>
                                <th style="padding: 12px; text-align: center;">Ortalama</th>
                                <th style="padding: 12px; text-align: center;">Başarı</th>
                                <th style="padding: 12px; text-align: center;">Sıralama</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.data.students.map((s, i) => {
                                const grades = (this.data.grades || []).filter(g => g.studentId === s.id);
                                const avg = grades.length > 0 
                                    ? (grades.reduce((a, g) => a + parseFloat(g.score), 0) / grades.length).toFixed(1) 
                                    : '-';
                                return `
                                    <tr style="border-bottom: 1px solid var(--gray-200); ${i === 0 ? 'background: #fef3c7;' : ''}">
                                        <td style="padding: 12px;">${s.number}</td>
                                        <td style="padding: 12px;">${s.name}</td>
                                        <td style="padding: 12px; text-align: center; font-weight: bold;">${avg}</td>
                                        <td style="padding: 12px; text-align: center;">
                                            <span class="badge ${parseFloat(avg) >= 70 ? 'badge-success' : parseFloat(avg) >= 50 ? 'badge-warning' : 'badge-danger'}">
                                                ${parseFloat(avg) >= 70 ? 'Başarılı' : parseFloat(avg) >= 50 ? 'Geçer' : 'Başarısız'}
                                            </span>
                                        </td>
                                        <td style="padding: 12px; text-align: center;">#${i + 1}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('reportPreview').innerHTML = reportHtml;
    },

    generateAttendanceReport() {
        const studentId = document.getElementById('attendanceStudent')?.value;
        if (!studentId) {
            this.showToast('Lütfen öğrenci seçin!', 'error');
            return;
        }

        const student = this.data.students.find(s => s.id === studentId);
        const attendance = (this.data.attendance || []).filter(a => a.studentId === studentId);
        
        const reportHtml = `
            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; padding: 30px; border-bottom: 2px solid var(--gray-200);">
                    <h2 style="color: var(--primary);">Devamsızlık Raporu</h2>
                </div>
                
                <div style="padding: 30px;">
                    <h3 style="margin-bottom: 20px;">${student?.name} - No: ${student?.number}</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
                        <div style="padding: 20px; background: #d1fae5; border-radius: var(--radius); text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; color: #065f46;">${attendance.filter(a => a.status === 'present').length}</div>
                            <div style="color: #065f46;">Devamsız (Gün)</div>
                        </div>
                        <div style="padding: 20px; background: #fee2e2; border-radius: var(--radius); text-align: center;">
                            <div style="font-size: 36px; font-weight: bold; color: #991b1b;">${attendance.filter(a => a.status === 'absent').length}</div>
                            <div style="color: #991b1b;">Devamsız (Gün)</div>
                        </div>
                    </div>

                    <h4 style="margin-bottom: 15px;">Detaylı Kayıt</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: var(--gray-100);">
                                <th style="padding: 10px;">Tarih</th>
                                <th style="padding: 10px;">Durum</th>
                                <th style="padding: 10px;">Not</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${attendance.sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => `
                                <tr style="border-bottom: 1px solid var(--gray-200);">
                                    <td style="padding: 10px;">${a.date}</td>
                                    <td style="padding: 10px;">
                                        <span class="badge ${a.status === 'present' ? 'badge-success' : a.status === 'absent' ? 'badge-danger' : 'badge-warning'}">
                                            ${a.status === 'present' ? 'Var' : a.status === 'absent' ? 'Yok' : 'Geç'}
                                        </span>
                                    </td>
                                    <td style="padding: 10px; color: var(--gray-500);">${a.note || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('reportPreview').innerHTML = reportHtml;
    },

    renderParentReport() {
        const studentId = this.currentUser.studentId;
        const student = this.data.students.find(s => s.id === studentId);
        
        if (!student) {
            return '<p class="empty-state">Bağlı öğrenci bulunamadı</p>';
        }

        const grades = (this.data.grades || []).filter(g => g.studentId === studentId);
        const attendance = (this.data.attendance || []).filter(a => a.studentId === studentId);
        const avgGrade = grades.length > 0 
            ? (grades.reduce((a, g) => a + parseFloat(g.score), 0) / grades.length).toFixed(1) 
            : '-';

        return `
            <div class="page-header">
                <h1 class="page-title">📊 ${student.name} - Veli Raporu</h1>
            </div>

            <div class="card" style="max-width: 900px; margin: 0 auto;">
                <div style="text-align: center; padding: 30px; border-bottom: 2px solid var(--gray-200);">
                    <div class="student-avatar" style="width: 80px; height: 80px; font-size: 32px; margin: 0 auto 15px; background: var(--primary);">${student.name.charAt(0)}</div>
                    <h2>${student.name}</h2>
                    <p style="color: var(--gray-500);">${this.data.settings.className || 'Sınıf'} - ${this.data.settings.schoolYear || ''}</p>
                </div>

                <div style="padding: 30px;">
                    <h3 style="margin-bottom: 20px;">📈 Genel Performans</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
                        <div style="padding: 20px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: var(--radius); text-align: center; color: white;">
                            <div style="font-size: 32px; font-weight: bold;">${avgGrade}</div>
                            <div style="font-size: 12px; opacity: 0.9;">Ortalama</div>
                        </div>
                        <div style="padding: 20px; background: #d1fae5; border-radius: var(--radius); text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #065f46;">${grades.length}</div>
                            <div style="font-size: 12px; color: #065f46;">Toplam Not</div>
                        </div>
                        <div style="padding: 20px; background: #fee2e2; border-radius: var(--radius); text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #991b1b;">${attendance.filter(a => a.status === 'absent').length}</div>
                            <div style="font-size: 12px; color: #991b1b;">Devamsız Gün</div>
                        </div>
                        <div style="padding: 20px; background: #ffedd5; border-radius: var(--radius); text-align: center;">
                            <div style="font-size: 32px; font-weight: bold; color: #92400e;">${attendance.filter(a => a.status === 'late').length}</div>
                            <div style="font-size: 12px; color: #92400e;">Geç Kalan</div>
                        </div>
                    </div>

                    <h3 style="margin-bottom: 15px;">📚 Ders Performansı</h3>
                    <div style="margin-bottom: 30px;">
                        ${[...new Set(grades.map(g => g.subject))].map(subj => {
                            const subjGrades = grades.filter(g => g.subject === subj);
                            const avg = (subjGrades.reduce((a, g) => a + parseFloat(g.score), 0) / subjGrades.length).toFixed(1);
                            return `
                                <div style="margin-bottom: 15px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <span>${subj}</span>
                                        <span><strong>${avg}</strong></span>
                                    </div>
                                    <div class="grade-progress-bar">
                                        <div class="grade-progress-fill ${parseFloat(avg) >= 70 ? 'high' : parseFloat(avg) >= 50 ? 'medium' : 'low'}" style="width: ${avg}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <h3 style="margin-bottom: 15px;">💬 Öğretmen Yorumu</h3>
                    <div style="padding: 20px; background: var(--gray-100); border-radius: var(--radius); font-style: italic; color: var(--gray-600);">
                        ${student.comment || 'Henüz öğretmen yorumu eklenmedi.'}
                    </div>

                    <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-radius: var(--radius); border: 1px solid #bfdbfe;">
                        <h4 style="color: #1e40af; margin-bottom: 10px;">📋 Veliler İçin Not</h4>
                        <p style="color: #1e40af; font-size: 14px;">
                            Bu rapor dönem içindeki genel performansı özetlemektedir. 
                            Detaylı bilgi için öğretmenlerle iletişime geçebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
