const App = {
    data: {
        settings: {
            className: '',
            classLevel: '',
            term: '',
            schoolYear: '',
            theme: 'default'
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
        notifications: [],
        materials: [],
        events: [],
        parentMeetings: [],
        behaviors: [],
        weeklyReports: [],
        diaries: [],
        meals: [],
        achievements: [],
        birthdays: [],
        tournaments: [],
        galleries: [],
        quotes: [
            "Başarı, hazırlık ve fırsatın buluştuğu yerdir.",
            "Öğrenmek, asla bitmeyen bir yolculuktur.",
            "Her gün biraz daha iyi olmaya çalış.",
            "Başarısızlık, başarının annesidir.",
            "Azimle çalışan her hayali gerçekleştirir.",
            "Öğrenmek, en güzel yatırımdır.",
            "Bugün yapılacak işi yarına bırakma.",
            "Küçük adımlar büyük sonuçlar doğurur.",
            "Her engel, bir öğrenme fırsatıdır.",
            "Kendine inan, her şeyi başarabilirsin."
        ],
        loginLogs: [],
        polls: [],
        reminders: [],
        studyTopics: [],
        reportTemplates: [],
        badgeSettings: [],
        dashboardOrder: [],
        lastBackup: null
    },
    currentUser: null,
    currentPage: 'dashboard',

    init() {
        this.checkAuth();
        this.initDarkMode();
        this.initLanguage();
    },

    initLanguage() {
        const langDisplay = document.getElementById('currentLang');
        if (langDisplay) {
            langDisplay.textContent = i18n.currentLang.toUpperCase();
        }
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
                ? '<i class="fas fa-sun"></i><span>' + i18n.t('lightMode') + '</span>'
                : '<i class="fas fa-moon"></i><span>' + i18n.t('darkMode') + '</span>';
        }
    },

    changeLanguage(lang) {
        i18n.setLang(lang);
        document.getElementById('currentLang').textContent = lang.toUpperCase();
        document.getElementById('langMenu').style.display = 'none';
        this.renderNavMenu();
        this.navigate(this.currentPage);
        this.showToast(i18n.t('settingsSaved'));
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
            settings: { className: '', classLevel: '', term: '', schoolYear: '', theme: 'default' },
            students: [], teachers: [], subjects: [], grades: [], schedule: [], exams: [], attendance: [],
            announcements: [], assignments: [], clubs: [], library: [],
            badges: [], starPoints: [], moods: [], goals: [], rewards: [],
            materials: [], events: [], parentMeetings: [], behaviors: [], weeklyReports: [],
            diaries: [], meals: [], achievements: [], birthdays: [], tournaments: [], galleries: [],
            quotes: [
                "Başarı, hazırlık ve fırsatın buluştuğu yerdir.",
                "Öğrenmek, asla bitmeyen bir yolculuktur.",
                "Her gün biraz daha iyi olmaya çalış.",
                "Başarısızlık, başarının annesidir.",
                "Azimle çalışan her hayali gerçekleştirir."
            ],
            loginLogs: [],
            polls: [],
            reminders: [],
            studyTopics: [],
            reportTemplates: [],
            badgeSettings: [],
            dashboardOrder: [],
            lastBackup: null
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
                if (!this.data.materials) this.data.materials = [];
                if (!this.data.events) this.data.events = [];
                if (!this.data.parentMeetings) this.data.parentMeetings = [];
                if (!this.data.behaviors) this.data.behaviors = [];
                if (!this.data.weeklyReports) this.data.weeklyReports = [];
                if (!this.data.diaries) this.data.diaries = [];
                if (!this.data.meals) this.data.meals = [];
                if (!this.data.achievements) this.data.achievements = [];
                if (!this.data.birthdays) this.data.birthdays = [];
                if (!this.data.tournaments) this.data.tournaments = [];
                if (!this.data.galleries) this.data.galleries = [];
                if (!this.data.loginLogs) this.data.loginLogs = [];
                if (!this.data.polls) this.data.polls = [];
                if (!this.data.reminders) this.data.reminders = [];
                if (!this.data.studyTopics) this.data.studyTopics = [];
                if (!this.data.reportTemplates) this.data.reportTemplates = [];
                if (!this.data.badgeSettings) this.data.badgeSettings = [];
                if (!this.data.dashboardOrder) this.data.dashboardOrder = [];
                this.applyTheme();
            } catch(e) {
                this.data = defaultData;
            }
        } else {
            this.data = defaultData;
        }
        
        this.logLogin();
    },

    logLogin() {
        const log = {
            user: this.currentUser?.name || 'unknown',
            role: this.currentUser?.role || 'unknown',
            time: new Date().toISOString(),
            action: 'login'
        };
        this.data.loginLogs.push(log);
        if (this.data.loginLogs.length > 100) {
            this.data.loginLogs = this.data.loginLogs.slice(-100);
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
        let menuSections = [];

        if (role === 'admin') {
            menuSections = [
                {
                    title: 'ANA PANEL',
                    icon: 'fa-home',
                    items: [
                        { page: 'dashboard', icon: 'fa-home', label: 'Ana Panel' },
                        { page: 'announcements', icon: 'fa-bullhorn', label: 'Duyurular' }
                    ]
                },
                {
                    title: 'YÖNETİM',
                    icon: 'fa-cogs',
                    items: [
                        { page: 'users', icon: 'fa-users-cog', label: 'Kullanıcılar' },
                        { page: 'students', icon: 'fa-user-graduate', label: 'Öğrenciler' },
                        { page: 'teachers', icon: 'fa-chalkboard-teacher', label: 'Öğretmenler' },
                        { page: 'loginlogs', icon: 'fa-history', label: 'Giriş Logları' },
                        { page: 'importdata', icon: 'fa-upload', label: 'Veri İçe Aktar' },
                        { page: 'backups', icon: 'fa-database', label: 'Yedekleme' },
                        { page: 'themes', icon: 'fa-palette', label: 'Temalar' },
                        { page: 'settings', icon: 'fa-cog', label: 'Ayarlar' }
                    ]
                },
                {
                    title: 'EĞİTİM',
                    icon: 'fa-graduation-cap',
                    items: [
                        { page: 'grades', icon: 'fa-chart-line', label: 'Not Girişi' },
                        { page: 'gradeanalysis', icon: 'fa-chart-bar', label: 'Not Analizi' },
                        { page: 'examanalysis', icon: 'fa-chart-pie', label: 'Sınav Analizi' },
                        { page: 'materials', icon: 'fa-book-open', label: 'Ders Materyalleri' },
                        { page: 'assignments', icon: 'fa-tasks', label: 'Ödevler' },
                        { page: 'assignmentcalendar', icon: 'fa-calendar-alt', label: 'Ödev Takvimi' },
                        { page: 'study', icon: 'fa-book-reader', label: 'Sınav Hazırlık' },
                        { page: 'schedule', icon: 'fa-calendar-week', label: 'Ders Programı' },
                        { page: 'exams', icon: 'fa-file-alt', label: 'Deneme Çizelgesi' },
                        { page: 'trialresults', icon: 'fa-chart-bar', label: 'Deneme Sonuçları' },
                        { page: 'attendance', icon: 'fa-clipboard-list', label: 'Devamsızlık' },
                        { page: 'behavior', icon: 'fa-heart', label: 'Davranış Takibi' },
                        { page: 'meals', icon: 'fa-utensils', label: 'Beslenme Takibi' }
                    ]
                },
                {
                    title: 'TAKİP & RAPOR',
                    icon: 'fa-chart-pie',
                    items: [
                        { page: 'studentprofile', icon: 'fa-id-card', label: 'Öğrenci Profili' },
                        { page: 'calendar', icon: 'fa-calendar', label: 'Okul Takvimi' },
                        { page: 'events', icon: 'fa-party-horn', label: 'Sınıf Etkinlikleri' },
                        { page: 'parentmeetings', icon: 'fa-users', label: 'Veli Toplantıları' },
                        { page: 'meetingnotes', icon: 'fa-sticky-note', label: 'Toplantı Notları' },
                        { page: 'weeklyreport', icon: 'fa-file-alt', label: 'Haftalık Rapor' },
                        { page: 'report', icon: 'fa-file-pdf', label: 'Karne/Rapor' },
                        { page: 'polls', icon: 'fa-vote-yea', label: 'Anketler' },
                        { page: 'reminders', icon: 'fa-bell', label: 'Hatırlatıcılar' }
                    ]
                },
                {
                    title: 'SOSYAL & AKTİVİTE',
                    icon: 'fa-users',
                    items: [
                        { page: 'clubs', icon: 'fa-users', label: 'Kulüpler' },
                        { page: 'library', icon: 'fa-book', label: 'Kütüphane' },
                        { page: 'badges', icon: 'fa-award', label: 'Rozetler' },
                        { page: 'badgedesign', icon: 'fa-palette', label: 'Rozet Tasarımı' },
                        { page: 'leaderboard', icon: 'fa-trophy', label: 'Liderlik' },
                        { page: 'stars', icon: 'fa-star', label: 'Yıldız Puanı' },
                        { page: 'achievements', icon: 'fa-medal', label: 'Başarı Panosu' },
                        { page: 'birthdays', icon: 'fa-birthday-cake', label: 'Doğum Günleri' },
                        { page: 'tournaments', icon: 'fa-gamepad', label: 'Spor Turnuvaları' },
                        { page: 'gallery', icon: 'fa-images', label: 'Galeri' }
                    ]
                },
                {
                    title: 'EĞLENCE',
                    icon: 'fa-gamepad',
                    items: [
                        { page: 'quote', icon: 'fa-quote-left', label: 'Günün Sözü' },
                        { page: 'games', icon: 'fa-puzzle-piece', label: 'Zeka Oyunları' }
                    ]
                },
                {
                    title: 'ARAÇLAR',
                    icon: 'fa-tools',
                    items: [
                        { page: 'messages', icon: 'fa-comments', label: 'Mesajlar' },
                        { page: 'files', icon: 'fa-folder', label: 'Dosyalar' },
                        { page: 'notifications', icon: 'fa-bell', label: 'Bildirimler' },
                        { page: 'goals', icon: 'fa-bullseye', label: 'Hedefler' },
                        { page: 'rewards', icon: 'fa-gift', label: 'Ödüller' }
                    ]
                }
            ];
        } else if (role === 'teacher') {
            menuSections = [
                {
                    title: 'ANA PANEL',
                    icon: 'fa-home',
                    items: [
                        { page: 'dashboard', icon: 'fa-home', label: 'Ana Panel' },
                        { page: 'announcements', icon: 'fa-bullhorn', label: 'Duyurular' }
                    ]
                },
                {
                    title: 'EĞİTİM',
                    icon: 'fa-graduation-cap',
                    items: [
                        { page: 'grades', icon: 'fa-chart-line', label: 'Not Girişi' },
                        { page: 'materials', icon: 'fa-book-open', label: 'Ders Materyalleri' },
                        { page: 'assignments', icon: 'fa-tasks', label: 'Ödevler' },
                        { page: 'assignmentcalendar', icon: 'fa-calendar-alt', label: 'Ödev Takvimi' },
                        { page: 'study', icon: 'fa-book-reader', label: 'Sınav Hazırlık' },
                        { page: 'schedule', icon: 'fa-calendar-week', label: 'Ders Programı' },
                        { page: 'attendance', icon: 'fa-clipboard-list', label: 'Yoklama' },
                        { page: 'students', icon: 'fa-user-graduate', label: 'Öğrenciler' },
                        { page: 'trialresults', icon: 'fa-chart-bar', label: 'Deneme Sonuçları' },
                        { page: 'behavior', icon: 'fa-heart', label: 'Davranış Takibi' },
                        { page: 'meals', icon: 'fa-utensils', label: 'Beslenme Takibi' }
                    ]
                },
                {
                    title: 'TAKİP & RAPOR',
                    icon: 'fa-chart-pie',
                    items: [
                        { page: 'studentprofile', icon: 'fa-id-card', label: 'Öğrenci Profili' },
                        { page: 'events', icon: 'fa-party-horn', label: 'Sınıf Etkinlikleri' },
                        { page: 'parentmeetings', icon: 'fa-users', label: 'Veli Toplantıları' },
                        { page: 'meetingnotes', icon: 'fa-sticky-note', label: 'Toplantı Notları' },
                        { page: 'weeklyreport', icon: 'fa-file-alt', label: 'Haftalık Rapor' },
                        { page: 'report', icon: 'fa-file-pdf', label: 'Karne/Rapor' },
                        { page: 'diaries', icon: 'fa-book', label: 'Öğrenci Günlüğü' },
                        { page: 'polls', icon: 'fa-vote-yea', label: 'Anketler' },
                        { page: 'reminders', icon: 'fa-bell', label: 'Hatırlatıcılar' }
                    ]
                },
                {
                    title: 'SOSYAL & AKTİVİTE',
                    icon: 'fa-users',
                    items: [
                        { page: 'clubs', icon: 'fa-users', label: 'Kulüpler' },
                        { page: 'stars', icon: 'fa-star', label: 'Yıldız Ver' },
                        { page: 'badges', icon: 'fa-award', label: 'Rozet Ver' },
                        { page: 'badgedesign', icon: 'fa-palette', label: 'Rozet Tasarımı' },
                        { page: 'goals', icon: 'fa-bullseye', label: 'Hedefler' },
                        { page: 'achievements', icon: 'fa-medal', label: 'Başarı Panosu' },
                        { page: 'birthdays', icon: 'fa-birthday-cake', label: 'Doğum Günleri' },
                        { page: 'tournaments', icon: 'fa-gamepad', label: 'Spor Turnuvaları' },
                        { page: 'gallery', icon: 'fa-images', label: 'Galeri' }
                    ]
                },
                {
                    title: 'EĞLENCE',
                    icon: 'fa-gamepad',
                    items: [
                        { page: 'quote', icon: 'fa-quote-left', label: 'Günün Sözü' },
                        { page: 'games', icon: 'fa-puzzle-piece', label: 'Zeka Oyunları' }
                    ]
                },
                {
                    title: 'ARAÇLAR',
                    icon: 'fa-tools',
                    items: [
                        { page: 'messages', icon: 'fa-comments', label: 'Mesajlar' },
                        { page: 'files', icon: 'fa-folder', label: 'Dosyalar' },
                        { page: 'report', icon: 'fa-file-pdf', label: 'Karne/Rapor' }
                    ]
                }
            ];
        } else if (role === 'student') {
            menuSections = [
                {
                    title: 'ANA PANEL',
                    icon: 'fa-home',
                    items: [
                        { page: 'dashboard', icon: 'fa-home', label: 'Ana Panel' },
                        { page: 'myprofile', icon: 'fa-user', label: 'Profilim' },
                        { page: 'announcements', icon: 'fa-bullhorn', label: 'Duyurular' },
                        { page: 'mood', icon: 'fa-smile', label: 'Bugün Nasılım?' }
                    ]
                },
                {
                    title: 'EĞİTİMİM',
                    icon: 'fa-graduation-cap',
                    items: [
                        { page: 'mygrades', icon: 'fa-chart-line', label: 'Notlarım' },
                        { page: 'gradeanalysis', icon: 'fa-chart-bar', label: 'Gelişimim' },
                        { page: 'lgsanalysis', icon: 'fa-graduation-cap', label: 'LGS Analiz' },
                        { page: 'mymaterials', icon: 'fa-book-open', label: 'Materyallerim' },
                        { page: 'myassignments', icon: 'fa-tasks', label: 'Ödevlerim' },
                        { page: 'myschedule', icon: 'fa-calendar-week', label: 'Ders Programım' },
                        { page: 'myattendance', icon: 'fa-clipboard-list', label: 'Devamsızlığım' },
                        { page: 'myexams', icon: 'fa-file-alt', label: 'Deneme Takvimi' },
                        { page: 'mytrialresults', icon: 'fa-chart-bar', label: 'Deneme Sonuçlarım' },
                        { page: 'mystudytopics', icon: 'fa-book-reader', label: 'Çalışma Listem' },
                        { page: 'mybehavior', icon: 'fa-heart', label: 'Davranış Kartım' }
                    ]
                },
                {
                    title: 'TAKİP & BİLGİ',
                    icon: 'fa-chart-pie',
                    items: [
                        { page: 'calendar', icon: 'fa-calendar', label: 'Okul Takvimi' },
                        { page: 'myevents', icon: 'fa-party-horn', label: 'Etkinlikler' },
                        { page: 'myreport', icon: 'fa-file-alt', label: 'Haftalık Raporum' },
                        { page: 'mydiary', icon: 'fa-book', label: 'Günlüğüm' },
                        { page: 'polls', icon: 'fa-vote-yea', label: 'Anketler' },
                        { page: 'reminders', icon: 'fa-bell', label: 'Hatırlatıcılarım' }
                    ]
                },
                {
                    title: 'SOSYAL & AKTİVİTE',
                    icon: 'fa-users',
                    items: [
                        { page: 'clubs', icon: 'fa-users', label: 'Kulüpler' },
                        { page: 'library', icon: 'fa-book', label: 'Kütüphane' },
                        { page: 'mybadges', icon: 'fa-award', label: 'Rozetlerim' },
                        { page: 'leaderboard', icon: 'fa-trophy', label: 'Liderlik' },
                        { page: 'mystars', icon: 'fa-star', label: 'Yıldızlarım' },
                        { page: 'myachievements', icon: 'fa-medal', label: 'Başarılarım' },
                        { page: 'mybirthday', icon: 'fa-birthday-cake', label: 'Doğum Günüm' },
                        { page: 'mytournaments', icon: 'fa-gamepad', label: 'Turnuvalar' },
                        { page: 'mygallery', icon: 'fa-images', label: 'Galeri' }
                    ]
                },
                {
                    title: 'EĞLENCE',
                    icon: 'fa-gamepad',
                    items: [
                        { page: 'quote', icon: 'fa-quote-left', label: 'Günün Sözü' },
                        { page: 'games', icon: 'fa-puzzle-piece', label: 'Zeka Oyunları' }
                    ]
                },
                {
                    title: 'ARAÇLAR',
                    icon: 'fa-tools',
                    items: [
                        { page: 'messages', icon: 'fa-comments', label: 'Mesajlar' },
                        { page: 'myfiles', icon: 'fa-folder', label: 'Dosyalarım' },
                        { page: 'mygoals', icon: 'fa-bullseye', label: 'Hedeflerim' },
                        { page: 'rewards', icon: 'fa-gift', label: 'Ödüller' }
                    ]
                }
            ];
        } else if (role === 'parent') {
            menuSections = [
                {
                    title: 'ANA PANEL',
                    icon: 'fa-home',
                    items: [
                        { page: 'dashboard', icon: 'fa-home', label: 'Ana Panel' }
                    ]
                },
                {
                    title: 'ÇOCUKUM',
                    icon: 'fa-child',
                    items: [
                        { page: 'childgrades', icon: 'fa-chart-line', label: 'Notları' },
                        { page: 'childattendance', icon: 'fa-clipboard-list', label: 'Devamsızlığı' },
                        { page: 'childmood', icon: 'fa-smile', label: 'Ruh Hali' },
                        { page: 'childbehavior', icon: 'fa-heart', label: 'Davranışı' }
                    ]
                },
                {
                    title: 'TAKİP & BİLGİ',
                    icon: 'fa-chart-pie',
                    items: [
                        { page: 'schedule', icon: 'fa-calendar-week', label: 'Ders Programı' },
                        { page: 'calendar', icon: 'fa-calendar', label: 'Okul Takvimi' },
                        { page: 'parentreport', icon: 'fa-file-pdf', label: 'Veli Raporu' },
                        { page: 'parentmeetings', icon: 'fa-users', label: 'Veli Toplantıları' },
                        { page: 'childmeals', icon: 'fa-utensils', label: 'Beslenme' }
                    ]
                },
                {
                    title: 'İLETİŞİM',
                    icon: 'fa-comments',
                    items: [
                        { page: 'messages', icon: 'fa-comments', label: 'Mesajlar' },
                        { page: 'polls', icon: 'fa-vote-yea', label: 'Anketler' }
                    ]
                },
                {
                    title: 'EĞLENCE',
                    icon: 'fa-gamepad',
                    items: [
                        { page: 'quote', icon: 'fa-quote-left', label: 'Günün Sözü' }
                    ]
                }
            ];
        }

        let html = '';
        for (let s = 0; s < menuSections.length; s++) {
            const section = menuSections[s];
            html += '<div class="nav-section">';
            html += '<div class="nav-section-header" onclick="App.toggleNavSection(this)">';
            html += '<i class="fas ' + section.icon + '"></i>';
            html += '<span>' + section.title + '</span>';
            html += '<i class="fas fa-chevron-down nav-section-arrow"></i>';
            html += '</div>';
            html += '<div class="nav-section-items">';
            for (let i = 0; i < section.items.length; i++) {
                const item = section.items[i];
                const activeClass = this.currentPage === item.page ? ' active' : '';
                html += '<a href="#" class="nav-item' + activeClass + '" data-page="' + item.page + '"><i class="fas ' + item.icon + '"></i><span>' + item.label + '</span></a>';
            }
            html += '</div>';
            html += '</div>';
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

    toggleNavSection(header) {
        const section = header.parentElement;
        const items = section.querySelector('.nav-section-items');
        const arrow = header.querySelector('.nav-section-arrow');
        if (items.style.display === 'none') {
            items.style.display = 'block';
            section.classList.remove('collapsed');
            arrow.style.transform = 'rotate(0deg)';
        } else {
            items.style.display = 'none';
            section.classList.add('collapsed');
            arrow.style.transform = 'rotate(-90deg)';
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
            materials: () => this.renderMaterials(),
            mymaterials: () => this.renderMyMaterials(),
            schedule: () => this.renderSchedule(),
            exams: () => this.renderExams(),
            trialresults: () => this.renderTrialResults(),
            mytrialresults: () => this.renderMyTrialResults(),
            attendance: () => this.renderAttendance(),
            myattendance: () => this.renderMyAttendance(),
            childattendance: () => this.renderChildAttendance(),
            settings: () => this.renderSettings(),
            announcements: () => this.renderAnnouncements(),
            assignments: () => this.renderAssignments(),
            myassignments: () => this.renderMyAssignments(),
            assignmentcalendar: () => this.renderAssignmentCalendar(),
            clubs: () => this.renderClubs(),
            library: () => this.renderLibrary(),
            mygrades: () => this.renderMyGrades(),
            childgrades: () => this.renderChildGrades(),
            myschedule: () => this.renderMySchedule(),
            myexams: () => this.renderMyExams(),
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
            parentreport: () => this.renderParentReport(),
            calendar: () => this.renderCalendar(),
            events: () => this.renderEvents(),
            myevents: () => this.renderMyEvents(),
            parentmeetings: () => this.renderParentMeetings(),
            behavior: () => this.renderBehavior(),
            mybehavior: () => this.renderMyBehavior(),
            childbehavior: () => this.renderChildBehavior(),
            weeklyreport: () => this.renderWeeklyReport(),
            myreport: () => this.renderMyReport(),
            diaries: () => this.renderDiaries(),
            mydiary: () => this.renderMyDiary(),
            meals: () => this.renderMeals(),
            childmeals: () => this.renderChildMeals(),
            achievements: () => this.renderAchievements(),
            myachievements: () => this.renderMyAchievements(),
            birthdays: () => this.renderBirthdays(),
            mybirthday: () => this.renderMyBirthday(),
            tournaments: () => this.renderTournaments(),
            mytournaments: () => this.renderMyTournaments(),
            gallery: () => this.renderGallery(),
            mygallery: () => this.renderMyGallery(),
            quote: () => this.renderQuote(),
            games: () => this.renderGames(),
            loginlogs: () => this.renderLoginLogs(),
            polls: () => this.renderPolls(),
            reminders: () => this.renderReminders(),
            study: () => this.renderStudyTopics(),
            mystudy: () => this.renderMyStudyTopics(),
            meetingnotes: () => this.renderMeetingNotes(),
            examanalysis: () => this.renderExamAnalysis(),
            studentprofile: () => this.renderStudentProfile(),
            myprofile: () => this.renderMyProfile(),
            badgedesign: () => this.renderBadgeDesign(),
            importdata: () => this.renderImportData(),
            backups: () => this.renderBackups(),
            themes: () => this.renderThemes()
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

    exportCurrentViewAsPDF() {
        // Prefer printing the report area if present
        const reportEl = document.getElementById('reportPreview');
        let content = reportEl && reportEl.innerHTML ? reportEl.innerHTML : document.body.innerHTML;
        // If the current page has a dedicated printable area, prefer that
        const printableSelector = '#pageContent';
        const printable = document.querySelector(printableSelector);
        if (printable) content = printable.outerHTML;

        const w = window.open('', '_blank');
        const style = `
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; }
            </style>
        `;
        w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Print</title>' + style + '</head><body>' + content + '</body></html>');
        w.document.close();
        w.focus();
        w.print();
        w.close();
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
        const totalGrades = this.data.grades.length;
        const avgGrade = totalGrades > 0 
            ? (this.data.grades.reduce((a, g) => a + (parseFloat(g.score) || 0), 0) / totalGrades).toFixed(1)
            : '-';
        const totalAnnouncements = this.data.announcements.length;
        const unreadNotifications = (this.data.notifications || []).filter(n => !n.read).length;
        const totalAbsences = (this.data.attendance || []).filter(a => a.status === 'absent').length;

        return `
            <div class="page-header">
                <h1 class="page-title">Admin Ana Panel</h1>
                <div style="display: flex; gap: 10px;">
                    <span style="display: flex; align-items: center; gap: 5px; color: var(--gray-500); font-size: 14px;">
                        <i class="fas fa-clock"></i> ${new Date().toLocaleDateString('tr-TR', {weekday: 'long', day: 'numeric', month: 'long'})}
                    </span>
                </div>
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
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info">
                        <h4>${avgGrade}</h4>
                        <p>Sınıf Ortalaması</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-bell"></i></div>
                    <div class="stat-info">
                        <h4>${unreadNotifications > 0 ? unreadNotifications : '-'}</h4>
                        <p>Okunmamış Bildirim</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions-grid">
                <button class="quick-action-btn" onclick="App.navigate('students')">
                    <i class="fas fa-user-plus"></i>
                    <span>Öğrenci Ekle</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('grades')">
                    <i class="fas fa-pen"></i>
                    <span>Not Girişi</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('attendance')">
                    <i class="fas fa-clipboard-check"></i>
                    <span>Yoklama Al</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('announcements')">
                    <i class="fas fa-bullhorn"></i>
                    <span>Duyuru Yap</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('messages')">
                    <i class="fas fa-paper-plane"></i>
                    <span>Mesaj Gönder</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('report')">
                    <i class="fas fa-file-pdf"></i>
                    <span>Karne Oluştur</span>
                </button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-user-graduate"></i> Son Eklenen Öğrenciler</span>
                        <button class="btn btn-sm" onclick="App.navigate('students')" style="padding: 5px 10px; font-size: 12px;">Tümü</button>
                    </div>
                    ${this.renderRecentStudents()}
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-chalkboard-teacher"></i> Son Eklenen Öğretmenler</span>
                        <button class="btn btn-sm" onclick="App.navigate('teachers')" style="padding: 5px 10px; font-size: 12px;">Tümü</button>
                    </div>
                    ${this.renderRecentTeachers()}
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-bullhorn"></i> Son Duyurular</span>
                        <button class="btn btn-sm" onclick="App.navigate('announcements')" style="padding: 5px 10px; font-size: 12px;">Tümü</button>
                    </div>
                    ${this.renderRecentAnnouncements()}
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-calendar-alt"></i> Yaklaşan Etkinlikler</span>
                    </div>
                    ${this.renderUpcomingEvents()}
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-chart-pie"></i> Sınıf Özeti</span>
                    </div>
                    ${this.renderClassSummary()}
                </div>
            </div>
        `;
    },

    renderRecentAnnouncements() {
        const recent = (this.data.announcements || []).slice(-5).reverse();
        if (recent.length === 0) {
            return '<p class="empty-state" style="padding: 20px;">Henüz duyuru yok</p>';
        }
        return recent.map(a => `
            <div style="padding: 12px 0; border-bottom: 1px solid var(--gray-200);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <strong style="font-size: 13px;">${a.title || 'Duyuru'}</strong>
                        <p style="font-size: 11px; color: var(--gray-500); margin-top: 3px;">${a.date || ''}</p>
                    </div>
                    <span class="badge badge-${a.priority === 'high' ? 'danger' : a.priority === 'normal' ? 'info' : 'success'}">${a.priority || 'normal'}</span>
                </div>
            </div>
        `).join('');
    },

    renderUpcomingEvents() {
        const today = new Date();
        const events = [];
        
        const exams = (this.data.exams || []).filter(e => new Date(e.date) >= today).slice(0, 3);
        exams.forEach(e => events.push({type: 'exam', title: e.name, date: e.date, icon: 'fa-file-alt', color: '#ef4444'}));
        
        const assignments = (this.data.assignments || []).filter(a => new Date(a.dueDate) >= today).slice(0, 3);
        assignments.forEach(a => events.push({type: 'assignment', title: a.title, date: a.dueDate, icon: 'fa-tasks', color: '#f59e0b'}));
        
        const announcements = (this.data.announcements || []).filter(a => a.priority === 'high').slice(-3);
        announcements.forEach(a => events.push({type: 'announcement', title: a.title, date: a.date, icon: 'fa-bullhorn', color: '#ef4444'}));
        
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        const displayEvents = events.slice(0, 5);
        
        if (displayEvents.length === 0) {
            return '<p class="empty-state" style="padding: 20px;">Yaklaşan etkinlik yok</p>';
        }
        
        return displayEvents.map(e => {
            const d = new Date(e.date);
            const daysLeft = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
            return `
                <div style="display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid var(--gray-200);">
                    <div style="width: 45px; height: 45px; background: ${e.color}20; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${e.icon}" style="color: ${e.color};"></i>
                    </div>
                    <div style="flex: 1;">
                        <strong style="font-size: 13px;">${e.title}</strong>
                        <p style="font-size: 11px; color: var(--gray-500);">${e.date}</p>
                    </div>
                    <span class="badge badge-${daysLeft <= 1 ? 'danger' : daysLeft <= 3 ? 'warning' : 'info'}">${daysLeft === 0 ? 'Bugün' : daysLeft === 1 ? 'Yarın' : daysLeft + ' gün'}</span>
                </div>
            `;
        }).join('');
    },

    renderClassSummary() {
        const totalStudents = this.data.students.length;
        const avgGrade = this.data.grades.length > 0 
            ? (this.data.grades.reduce((a, g) => a + (parseFloat(g.score) || 0), 0) / this.data.grades.length).toFixed(1)
            : '-';
        const passRate = this.data.grades.length > 0 
            ? ((this.data.grades.filter(g => parseFloat(g.score) >= 50).length / this.data.grades.length) * 100).toFixed(0)
            : '-';
        const totalAbsences = (this.data.attendance || []).filter(a => a.status === 'absent').length;
        const totalPresents = (this.data.attendance || []).filter(a => a.status === 'present').length;
        const totalClubs = this.data.clubs.length;
        const totalBadges = this.data.badges.length;

        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="padding: 15px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 12px; color: white; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold;">${avgGrade}</div>
                    <div style="font-size: 11px; opacity: 0.9;">Sınıf Ortalaması</div>
                </div>
                <div style="padding: 15px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; color: white; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold;">%${passRate}</div>
                    <div style="font-size: 11px; opacity: 0.9;">Geçme Oranı</div>
                </div>
                <div style="padding: 15px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; color: white; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold;">${totalAbsences}</div>
                    <div style="font-size: 11px; opacity: 0.9;">Toplam Devamsızlık</div>
                </div>
                <div style="padding: 15px; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); border-radius: 12px; color: white; text-align: center;">
                    <div style="font-size: 28px; font-weight: bold;">${totalClubs}</div>
                    <div style="font-size: 11px; opacity: 0.9;">Aktif Kulüp</div>
                </div>
            </div>
            <div style="margin-top: 15px; padding: 12px; background: var(--gray-100); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--gray-500); margin-bottom: 8px;">
                    <span>Okul Yılı</span>
                    <strong>${this.data.settings.schoolYear || 'Belirtilmedi'}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--gray-500); margin-bottom: 8px;">
                    <span>Sınıf</span>
                    <strong>${this.data.settings.className || 'Belirtilmedi'}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--gray-500);">
                    <span>Dönem</span>
                    <strong>${this.data.settings.term || '1'}. Dönem</strong>
                </div>
            </div>
        `;
    },

    renderTeacherDashboard() {
        const myGrades = this.data.grades.length;
        const mySchedule = this.data.schedule.length;
        const upcomingExams = this.data.exams.filter(e => new Date(e.date) >= new Date()).length;
        const unreadMessages = (this.data.messages || []).filter(m => !m.read && m.to === this.currentUser.name).length;
        const totalStudents = this.data.students.length;
        const avgGrade = this.data.grades.length > 0 
            ? (this.data.grades.reduce((a, g) => a + (parseFloat(g.score) || 0), 0) / this.data.grades.length).toFixed(1)
            : '-';

        return `
            <div class="page-header">
                <h1 class="page-title">Öğretmen Ana Panel</h1>
                <div style="display: flex; gap: 10px;">
                    <span style="display: flex; align-items: center; gap: 5px; color: var(--gray-500); font-size: 14px;">
                        <i class="fas fa-clock"></i> ${new Date().toLocaleDateString('tr-TR', {weekday: 'long', day: 'numeric', month: 'long'})}
                    </span>
                </div>
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
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="fas fa-user-graduate"></i></div>
                    <div class="stat-info">
                        <h4>${totalStudents}</h4>
                        <p>Öğrenci Sayısı</p>
                    </div>
                </div>
            </div>

            <div class="quick-actions-grid">
                <button class="quick-action-btn" onclick="App.navigate('grades')">
                    <i class="fas fa-pen"></i>
                    <span>Not Girişi</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('attendance')">
                    <i class="fas fa-clipboard-check"></i>
                    <span>Yoklama Al</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('assignments')">
                    <i class="fas fa-tasks"></i>
                    <span>Ödev Ver</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('announcements')">
                    <i class="fas fa-bullhorn"></i>
                    <span>Duyuru Yap</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('messages')">
                    <i class="fas fa-paper-plane"></i>
                    <span>Mesaj Gönder</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('stars')">
                    <i class="fas fa-star"></i>
                    <span>Yıldız Ver</span>
                </button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-chart-line"></i> Sınıf Genel Görünüm</span>
                    </div>
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; font-weight: bold; color: var(--primary);">${avgGrade}</div>
                        <p style="color: var(--gray-500);">Sınıf Ortalaması</p>
                        <div style="margin-top: 20px;">
                            <button class="btn btn-secondary" onclick="App.navigate('students')">
                                <i class="fas fa-users"></i> Öğrencileri Gör
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-calendar-alt"></i> Yaklaşan Etkinlikler</span>
                    </div>
                    ${this.renderUpcomingEvents()}
                </div>
            </div>
        `;
    },

    renderStudentDashboard() {
        const studentId = this.currentUser.studentId;
        const myGrades = studentId ? this.data.grades.filter(g => g.studentId === studentId) : [];
        const myAttendance = studentId ? this.data.attendance.filter(a => a.studentId === studentId) : [];
        const myStars = (this.data.starPoints || []).filter(s => s.studentId === studentId);
        const myBadges = (this.data.badges || []).filter(b => b.studentId === studentId);
        const unreadMessages = (this.data.messages || []).filter(m => !m.read && m.to === this.currentUser.name).length;
        
        const avgGrade = myGrades.length > 0 
            ? (myGrades.reduce((a, g) => a + parseFloat(g.score), 0) / myGrades.length).toFixed(1)
            : '-';
        
        const presentDays = myAttendance.filter(a => a.status === 'present').length;
        const absentDays = myAttendance.filter(a => a.status === 'absent').length;
        const totalStars = myStars.reduce((a, s) => a + (parseInt(s.points) || 0), 0);

        return `
            <div class="page-header">
                <h1 class="page-title">Hoş Geldin, ${this.currentUser.name}! <span style="font-size: 16px; color: var(--gray-500); font-weight: normal;">😊</span></h1>
                <div style="display: flex; gap: 10px;">
                    <span style="display: flex; align-items: center; gap: 5px; color: var(--gray-500); font-size: 14px;">
                        <i class="fas fa-clock"></i> ${new Date().toLocaleDateString('tr-TR', {weekday: 'long', day: 'numeric', month: 'long'})}
                    </span>
                </div>
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
                    <div class="stat-icon green"><i class="fas fa-star"></i></div>
                    <div class="stat-info">
                        <h4>${totalStars}</h4>
                        <p>Toplam Yıldızım</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-award"></i></div>
                    <div class="stat-info">
                        <h4>${myBadges.length}</h4>
                        <p>Rozetlerim</p>
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

            <div class="quick-actions-grid">
                <button class="quick-action-btn" onclick="App.navigate('mygrades')">
                    <i class="fas fa-chart-line"></i>
                    <span>Notlarım</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('mood')">
                    <i class="fas fa-smile"></i>
                    <span>Nasıl Hissediyorum?</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('myassignments')">
                    <i class="fas fa-tasks"></i>
                    <span>Ödevlerim</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('leaderboard')">
                    <i class="fas fa-trophy"></i>
                    <span>Liderlik</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('rewards')">
                    <i class="fas fa-gift"></i>
                    <span>Ödüller</span>
                </button>
                <button class="quick-action-btn" onclick="App.navigate('messages')">
                    <i class="fas fa-comments"></i>
                    <span>Mesajlarım${unreadMessages > 0 ? ' (' + unreadMessages + ')' : ''}</span>
                </button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
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
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Son Duyurular</span>
                    </div>
                    ${this.renderRecentAnnouncements()}
                </div>
            </div>

            ${myStars.length > 0 || myBadges.length > 0 ? `
            <div style="margin-top: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-trophy"></i> Başarılarım</span>
                    </div>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap; padding: 10px;">
                        ${totalStars > 0 ? '<div style="display: flex; align-items: center; gap: 8px; padding: 10px 15px; background: #fef3c7; border-radius: 20px;"><i class="fas fa-star" style="color: #f59e0b;"></i> <strong>' + totalStars + '</strong> Yıldız</div>' : ''}
                        ${myBadges.slice(-3).map(b => '<div style="display: flex; align-items: center; gap: 8px; padding: 10px 15px; background: #f3e8ff; border-radius: 20px;"><i class="fas ' + (b.icon || 'fa-award') + '" style="color: #a855f7;"></i> ' + (b.name || 'Rozet') + '</div>').join('')}
                    </div>
                </div>
            </div>
            ` : ''}
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
                    <button class="action-btn view" onclick="App.openFile('${f.id}')" title="Aç">
                        <i class="fas fa-eye"></i>
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

        const proceed = () => {
            this.data.files.push(fileData);
            this.saveData();
            this.closeModal();
            this.selectedFile = null;
            this.showToast('Dosya yüklendi!');
            this.renderPage(this.currentPage);
        };

        // If a file was selected, read it as Data URL for in-browser viewing
        if (this.selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                fileData.dataUrl = e.target?.result;
                proceed();
            };
            reader.readAsDataURL(this.selectedFile);
        } else {
            proceed();
        }
    },

    downloadFile(id) {
        const file = this.data.files.find(f => f.id === id);
        if (file) {
            // If Data URL exists, allow direct download/view via data URL
            if (file.dataUrl) {
                const a = document.createElement('a');
                a.href = file.dataUrl;
                a.download = file.fileName || file.name;
                a.click();
            } else {
                this.showToast(`${file.name} indirildi (simülasyon)`);
            }
        }
    },

    openFile(id) {
        const file = this.data.files.find(f => f.id === id);
        if (!file) return;
        if (file.dataUrl) {
            const w = window.open('', '_blank');
            if (w) {
                w.document.write(`<iframe width="100%" height="100%" src="${file.dataUrl}"></iframe>`);
            }
        } else {
            // Fallback to download behavior
            this.downloadFile(id);
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
                <button class="btn btn-secondary" onclick="App.exportCurrentViewAsPDF()" style="margin-left: auto;">PDF İndir</button>
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
                <button class="btn btn-secondary" onclick="App.exportCurrentViewAsPDF()" style="margin-left: auto;">PDF İndir</button>
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
    },

    renderMaterials() {
        const materials = (this.data.materials || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        return `
            <div class="page-header">
                <h1 class="page-title">Ders Materyalleri</h1>
                <button class="btn btn-primary" onclick="App.showMaterialModal()">
                    <i class="fas fa-plus"></i> Materyal Ekle
                </button>
            </div>

            <div class="search-filter">
                <input type="text" id="materialSearch" placeholder="Materyal ara..." oninput="App.filterMaterials()">
                <select id="materialSubject" onchange="App.filterMaterials()">
                    <option value="">Tüm Dersler</option>
                    ${[...new Set(this.data.grades.map(g => g.subject))].map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
            </div>

            <div id="materialsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                ${this.renderMaterialsGrid(materials)}
            </div>
        `;
    },

    renderMaterialsGrid(materials) {
        if (materials.length === 0) {
            return '<p class="empty-state">Henüz materyal eklenmedi</p>';
        }
        return materials.map(m => `
            <div class="card" style="cursor: pointer;" onclick="App.openMaterial('${m.id}')">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
                        <i class="fas ${this.getMaterialIcon(m.type)}"></i>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 3px;">${m.title}</h4>
                        <p style="font-size: 12px; color: var(--gray-500);">${m.subject}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: var(--gray-500); margin-bottom: 10px;">${m.description || ''}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--gray-400);">
                    <span><i class="fas fa-user"></i> ${m.teacher || 'Öğretmen'}</span>
                    <span><i class="fas fa-calendar"></i> ${m.date}</span>
                </div>
            </div>
        `).join('');
    },

    getMaterialIcon(type) {
        const icons = { pdf: 'fa-file-pdf', video: 'fa-video', document: 'fa-file-word', image: 'fa-image', link: 'fa-link', other: 'fa-file' };
        return icons[type] || 'fa-file';
    },

    filterMaterials() {
        const search = document.getElementById('materialSearch')?.value.toLowerCase() || '';
        const subject = document.getElementById('materialSubject')?.value || '';
        let materials = this.data.materials || [];
        if (search) materials = materials.filter(m => m.title.toLowerCase().includes(search) || m.description?.toLowerCase().includes(search));
        if (subject) materials = materials.filter(m => m.subject === subject);
        document.getElementById('materialsGrid').innerHTML = this.renderMaterialsGrid(materials);
    },

    showMaterialModal() {
        const content = `
            <form id="materialForm">
                <div class="form-group">
                    <label>Başlık *</label>
                    <input type="text" name="title" required placeholder="Materyal başlığı">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Ders</label>
                        <select name="subject">
                            <option value="">Seçin...</option>
                            ${[...new Set(this.data.grades.map(g => g.subject))].map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tür</label>
                        <select name="type">
                            <option value="document">Doküman</option>
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                            <option value="link">Link</option>
                            <option value="other">Diğer</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="3" placeholder="Materyal hakkında bilgi..."></textarea>
                </div>
                <div class="form-group">
                    <label>Link / URL</label>
                    <input type="url" name="url" placeholder="https://...">
                </div>
            </form>
        `;
        this.showModal('Ders Materyali Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Ekle', class: 'btn-primary', action: 'App.saveMaterial()' }
        ]);
    },

    saveMaterial() {
        const form = document.getElementById('materialForm');
        const formData = new FormData(form);
        const material = {
            id: this.generateId(),
            title: formData.get('title'),
            subject: formData.get('subject'),
            type: formData.get('type'),
            description: formData.get('description'),
            url: formData.get('url'),
            teacher: this.currentUser.name,
            date: new Date().toLocaleDateString('tr-TR')
        };
        if (!this.data.materials) this.data.materials = [];
        this.data.materials.push(material);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Materyal eklendi!');
    },

    openMaterial(id) {
        const material = this.data.materials.find(m => m.id === id);
        if (material && material.url) {
            window.open(material.url, '_blank');
        } else {
            this.showToast('Bu materyal için link yok', 'warning');
        }
    },

    renderMyMaterials() {
        const studentId = this.currentUser.studentId;
        const materials = (this.data.materials || []).filter(m => !m.subject || this.data.grades.some(g => g.studentId === studentId && g.subject === m.subject));
        return `
            <div class="page-header">
                <h1 class="page-title">Ders Materyallerim</h1>
            </div>
            <div id="materialsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                ${this.renderMaterialsGrid(materials)}
            </div>
        `;
    },

    renderAssignmentCalendar() {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const assignments = this.data.assignments || [];

        return `
            <div class="page-header">
                <h1 class="page-title">Ödev Takvimi</h1>
            </div>

            <div class="card" style="text-align: center;">
                <h2 style="margin-bottom: 20px;">${['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'][month]} ${year}</h2>
                <div class="schedule-grid" style="grid-template-columns: repeat(7, 1fr);">
                    ${['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => `<div class="schedule-header">${d}</div>`).join('')}
                    ${Array(firstDay === 0 ? 6 : firstDay - 1).fill('<div class="schedule-cell"></div>').join('')}
                    ${Array(daysInMonth).fill(0).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${day}/${month + 1}/${year}`;
                        const dayAssignments = assignments.filter(a => a.dueDate === dateStr);
                        const isToday = day === today.getDate();
                        return `
                            <div class="schedule-cell" style="${isToday ? 'background: rgba(79,70,229,0.1); border: 2px solid var(--primary);' : ''}">
                                <strong style="${isToday ? 'color: var(--primary);' : ''}">${day}</strong>
                                ${dayAssignments.map(a => `<div style="margin-top: 5px; padding: 3px 5px; background: #fef3c7; border-radius: 4px; font-size: 10px;">${a.title}</div>`).join('')}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div style="margin-top: 20px;">
                <h3 style="margin-bottom: 15px;">Bu Ayki Ödevler</h3>
                ${assignments.filter(a => {
                    const parts = a.dueDate?.split('/') || [];
                    return parts[1] == month + 1 && parts[2] == year;
                }).map(a => `
                    <div class="assignment-card">
                        <div class="assignment-header">
                            <span class="assignment-title"><i class="fas fa-tasks"></i> ${a.title}</span>
                            <span class="assignment-status ${a.status}">${a.status}</span>
                        </div>
                        <p style="color: var(--gray-500); font-size: 13px;">${a.description || ''}</p>
                        <div class="assignment-meta">
                            <span><i class="fas fa-calendar"></i> ${a.dueDate}</span>
                            <span><i class="fas fa-book"></i> ${a.subject || 'Genel'}</span>
                        </div>
                    </div>
                `).join('') || '<p class="empty-state">Bu ay ödev yok</p>'}
            </div>
        `;
    },

    renderCalendar() {
        const events = this.data.events || [];
        const holidays = [
            { date: '1/1/2026', name: 'Yılbaşı' },
            { date: '23/4/2026', name: '23 Nisan' },
            { date: '1/5/2026', name: 'İşçi Bayramı' },
            { date: '19/5/2026', name: 'Atatürk\'ü Anma' },
            { date: '15/7/2026', name: 'Demokrasi Bayramı' },
            { date: '30/8/2026', name: 'Zafer Bayramı' },
            { date: '29/10/2026', name: 'Cumhuriyet Bayramı' }
        ];

        return `
            <div class="page-header">
                <h1 class="page-title">Okul Takvimi</h1>
                ${this.currentUser.role === 'admin' || this.currentUser.role === 'teacher' ? `
                <button class="btn btn-primary" onclick="App.showEventModal()">
                    <i class="fas fa-plus"></i> Etkinlik Ekle
                </button>
                ` : ''}
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Yaklaşan Etkinlikler</span>
                    </div>
                    ${events.length > 0 ? events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => `
                        <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border-bottom: 1px solid var(--gray-200);">
                            <div style="text-align: center; padding: 10px; background: ${e.color || 'var(--primary)'}; border-radius: 8px; color: white; min-width: 60px;">
                                <div style="font-size: 20px; font-weight: bold;">${new Date(e.date).getDate()}</div>
                                <div style="font-size: 10px;">${['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][new Date(e.date).getMonth()]}</div>
                            </div>
                            <div style="flex: 1;">
                                <h4>${e.title}</h4>
                                <p style="font-size: 12px; color: var(--gray-500);">${e.description || ''}</p>
                            </div>
                        </div>
                    `).join('') : '<p class="empty-state">Henüz etkinlik yok</p>'}
                </div>

                <div class="card">
                    <div class="card-header">
                        <span class="card-title">Tatiller ve Özel Günler</span>
                    </div>
                    ${holidays.map(h => `
                        <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--gray-200);">
                            <span>${h.name}</span>
                            <span class="badge badge-info">${h.date}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    showEventModal() {
        const content = `
            <form id="eventForm">
                <div class="form-group">
                    <label>Etkinlik Adı *</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tarih *</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Renk</label>
                        <select name="color">
                            <option value="#4f46e5">Mor</option>
                            <option value="#10b981">Yeşil</option>
                            <option value="#f59e0b">Turuncu</option>
                            <option value="#ef4444">Kırmızı</option>
                            <option value="#ec4899">Pembe</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="3"></textarea>
                </div>
            </form>
        `;
        this.showModal('Etkinlik Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Ekle', class: 'btn-primary', action: 'App.saveEvent()' }
        ]);
    },

    saveEvent() {
        const form = document.getElementById('eventForm');
        const formData = new FormData(form);
        const event = {
            id: this.generateId(),
            title: formData.get('title'),
            date: formData.get('date'),
            color: formData.get('color'),
            description: formData.get('description'),
            createdBy: this.currentUser.name
        };
        if (!this.data.events) this.data.events = [];
        this.data.events.push(event);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Etkinlik eklendi!');
    },

    renderEvents() { return this.renderCalendar(); },
    renderMyEvents() { return this.renderCalendar(); },

    renderParentMeetings() {
        const meetings = this.data.parentMeetings || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Veli Toplantıları</h1>
                <button class="btn btn-primary" onclick="App.showMeetingModal()">
                    <i class="fas fa-plus"></i> Toplantı Oluştur
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Planlanan Toplantılar</span>
                </div>
                ${meetings.length > 0 ? meetings.sort((a, b) => new Date(a.date) - new Date(b.date)).map(m => `
                    <div style="padding: 15px; border-bottom: 1px solid var(--gray-200);">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4>${m.title}</h4>
                                <p style="font-size: 13px; color: var(--gray-500);">${m.description || ''}</p>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold; color: var(--primary);">${new Date(m.date).toLocaleDateString('tr-TR')}</div>
                                <div style="font-size: 12px; color: var(--gray-500);">${m.time || ''}</div>
                            </div>
                        </div>
                    </div>
                `).join('') : '<p class="empty-state">Henüz toplantı planlanmadı</p>'}
            </div>
        `;
    },

    showMeetingModal() {
        const content = `
            <form id="meetingForm">
                <div class="form-group">
                    <label>Toplantı Konusu *</label>
                    <input type="text" name="title" required placeholder="örn: Veli bilgilendirme toplantısı">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tarih *</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Saat</label>
                        <input type="time" name="time" value="17:00">
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="3" placeholder="Toplantı hakkında bilgi..."></textarea>
                </div>
            </form>
        `;
        this.showModal('Veli Toplantısı Oluştur', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Oluştur', class: 'btn-primary', action: 'App.saveMeeting()' }
        ]);
    },

    saveMeeting() {
        const form = document.getElementById('meetingForm');
        const formData = new FormData(form);
        const meeting = {
            id: this.generateId(),
            title: formData.get('title'),
            date: formData.get('date'),
            time: formData.get('time'),
            description: formData.get('description'),
            createdBy: this.currentUser.name
        };
        if (!this.data.parentMeetings) this.data.parentMeetings = [];
        this.data.parentMeetings.push(meeting);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Toplantı oluşturuldu!');
    },

    renderBehavior() {
        const behaviors = this.data.behaviors || [];
        const students = this.data.students;

        return `
            <div class="page-header">
                <h1 class="page-title">Davranış Takip Kartı</h1>
                <button class="btn btn-primary" onclick="App.showBehaviorModal()">
                    <i class="fas fa-plus"></i> Kayıt Ekle
                </button>
            </div>

            <div class="search-filter">
                <select id="behaviorStudent" onchange="App.filterBehaviors()">
                    <option value="">Tüm Öğrenciler</option>
                    ${students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
            </div>

            <div id="behaviorsList">
                ${this.renderBehaviorsList(behaviors)}
            </div>
        `;
    },

    renderBehaviorsList(behaviors) {
        if (behaviors.length === 0) return '<p class="empty-state">Henüz kayıt yok</p>';
        return behaviors.sort((a, b) => new Date(b.date) - new Date(a.date)).map(b => {
            const student = this.data.students.find(s => s.id === b.studentId);
            return `
                <div class="card" style="margin-bottom: 15px; border-left: 4px solid ${b.type === 'positive' ? '#10b981' : b.type === 'negative' ? '#ef4444' : '#f59e0b'};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4>${student?.name || 'Öğrenci'}</h4>
                            <p style="font-size: 13px; color: var(--gray-500);">${b.note}</p>
                        </div>
                        <div style="text-align: right;">
                            <span class="badge badge-${b.type === 'positive' ? 'success' : b.type === 'negative' ? 'danger' : 'warning'}">
                                ${b.type === 'positive' ? 'Olumlu' : b.type === 'negative' ? 'Olumsuz' : 'Not'}
                            </span>
                            <div style="font-size: 11px; color: var(--gray-400); margin-top: 5px;">${b.date}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    filterBehaviors() {
        const studentId = document.getElementById('behaviorStudent')?.value || '';
        let behaviors = this.data.behaviors || [];
        if (studentId) behaviors = behaviors.filter(b => b.studentId === studentId);
        document.getElementById('behaviorsList').innerHTML = this.renderBehaviorsList(behaviors);
    },

    showBehaviorModal() {
        const content = `
            <form id="behaviorForm">
                <div class="form-group">
                    <label>Öğrenci *</label>
                    <select name="studentId" required>
                        <option value="">Seçin...</option>
                        ${this.data.students.map(s => `<option value="${s.id}">${s.name} (${s.number})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Tür *</label>
                    <select name="type" required>
                        <option value="positive">Olumlu Davranış</option>
                        <option value="negative">Olumsuz Davranış</option>
                        <option value="note">Genel Not</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Not *</label>
                    <textarea name="note" rows="3" required placeholder="Davranış hakkında not..."></textarea>
                </div>
            </form>
        `;
        this.showModal('Davranış Kaydı Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: 'App.saveBehavior()' }
        ]);
    },

    saveBehavior() {
        const form = document.getElementById('behaviorForm');
        const formData = new FormData(form);
        const behavior = {
            id: this.generateId(),
            studentId: formData.get('studentId'),
            type: formData.get('type'),
            note: formData.get('note'),
            date: new Date().toLocaleDateString('tr-TR'),
            recordedBy: this.currentUser.name
        };
        if (!this.data.behaviors) this.data.behaviors = [];
        this.data.behaviors.push(behavior);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Kayıt eklendi!');
    },

    renderMyBehavior() {
        const studentId = this.currentUser.studentId;
        const behaviors = (this.data.behaviors || []).filter(b => b.studentId === studentId);
        const positives = behaviors.filter(b => b.type === 'positive').length;
        const negatives = behaviors.filter(b => b.type === 'negative').length;

        return `
            <div class="page-header">
                <h1 class="page-title">Davranış Kartım</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-thumbs-up"></i></div>
                    <div class="stat-info">
                        <h4>${positives}</h4>
                        <p>Olumlu</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red"><i class="fas fa-thumbs-down"></i></div>
                    <div class="stat-info">
                        <h4>${negatives}</h4>
                        <p>Olumsuz</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Davranış Geçmişim</span>
                </div>
                ${behaviors.length > 0 ? behaviors.sort((a, b) => new Date(b.date) - new Date(a.date)).map(b => `
                    <div style="padding: 12px; border-bottom: 1px solid var(--gray-200); display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p style="font-size: 13px;">${b.note}</p>
                            <p style="font-size: 11px; color: var(--gray-400);">${b.recordedBy} - ${b.date}</p>
                        </div>
                        <span class="badge badge-${b.type === 'positive' ? 'success' : b.type === 'negative' ? 'danger' : 'warning'}">
                            ${b.type === 'positive' ? 'Olumlu' : b.type === 'negative' ? 'Olumsuz' : 'Not'}
                        </span>
                    </div>
                `).join('') : '<p class="empty-state">Henüz kayıt yok</p>'}
            </div>
        `;
    },

    renderChildBehavior() {
        const studentId = this.currentUser.studentId;
        const behaviors = (this.data.behaviors || []).filter(b => b.studentId === studentId);
        return `
            <div class="page-header">
                <h1 class="page-title">Çocuğumun Davranışı</h1>
            </div>
            ${this.renderBehaviorsList(behaviors)}
        `;
    },

    renderWeeklyReport() {
        return `
            <div class="page-header">
                <h1 class="page-title">Haftalık Performans Raporu</h1>
                <button class="btn btn-secondary" onclick="App.exportCurrentViewAsPDF()">
                    <i class="fas fa-download"></i> PDF İndir
                </button>
            </div>

            <div class="card" style="max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; padding: 30px; border-bottom: 2px solid var(--gray-200);">
                    <h1 style="color: var(--primary);">${this.data.settings.className || 'Sınıf'} Haftalık Rapor</h1>
                    <p style="color: var(--gray-500);">${new Date().toLocaleDateString('tr-TR', {weekday: 'long', day: 'numeric', month: 'long'})}</p>
                </div>

                <div style="padding: 30px;">
                    <h3 style="margin-bottom: 15px;">📊 Sınıf Özeti</h3>
                    <div class="stats-grid" style="margin-bottom: 30px;">
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>${this.data.students.length}</h4>
                                <p>Öğrenci Sayısı</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-info">
                                <h4>${(this.data.grades || []).length}</h4>
                                <p>Girilen Not</p>
                            </div>
                        </div>
                    </div>

                    <h3 style="margin-bottom: 15px;">📅 Bu Hafta Yapılanlar</h3>
                    <div style="margin-bottom: 30px;">
                        ${(this.data.announcements || []).slice(-5).map(a => `
                            <div style="padding: 10px; border-left: 3px solid var(--primary); margin-bottom: 10px; background: var(--gray-100);">
                                <strong>${a.title}</strong>
                                <p style="font-size: 12px; color: var(--gray-500);">${a.date}</p>
                            </div>
                        `).join('') || '<p>Bu hafta duyuru yok</p>'}
                    </div>

                    <h3 style="margin-bottom: 15px;">📚 Yaklaşan Ödevler</h3>
                    <div>
                        ${(this.data.assignments || []).filter(a => a.status === 'pending').slice(0, 5).map(a => `
                            <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                                <span>${a.title}</span>
                                <span class="badge badge-warning">${a.dueDate}</span>
                            </div>
                        `).join('') || '<p>Yaklaşan ödev yok</p>'}
                    </div>
                </div>
            </div>
        `;
    },

    renderMyReport() {
        const studentId = this.currentUser.studentId;
        const grades = (this.data.grades || []).filter(g => g.studentId === studentId);
        const myBadges = (this.data.badges || []).filter(b => b.studentId === studentId);

        return `
            <div class="page-header">
                <h1 class="page-title">Haftalık Raporum</h1>
            </div>

            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; padding: 30px; border-bottom: 2px solid var(--gray-200);">
                    <h2 style="color: var(--primary);">${this.currentUser.name}</h2>
                    <p style="color: var(--gray-500);">${new Date().toLocaleDateString('tr-TR', {weekday: 'long', day: 'numeric', month: 'long'})}</p>
                </div>

                <div style="padding: 30px;">
                    <h3 style="margin-bottom: 15px;">📈 Haftalık Özet</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                        <div style="padding: 20px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 12px; color: white; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">${grades.length > 0 ? (grades.reduce((a, g) => a + parseFloat(g.score), 0) / grades.length).toFixed(1) : '-'}</div>
                            <div style="font-size: 12px;">Ortalama</div>
                        </div>
                        <div style="padding: 20px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; color: white; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold;">${myBadges.length}</div>
                            <div style="font-size: 12px;">Rozet</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderDiaries() {
        const diaries = this.data.diaries || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Öğrenci Günlüğü</h1>
                <button class="btn btn-primary" onclick="App.showDiaryModal()">
                    <i class="fas fa-plus"></i> Günlük Ekle
                </button>
            </div>

            <div id="diariesList">
                ${this.renderDiariesList(diaries)}
            </div>
        `;
    },

    renderDiariesList(diaries) {
        if (diaries.length === 0) return '<p class="empty-state">Henüz günlük yok</p>';
        return diaries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(d => `
            <div class="card" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <h4>${d.title}</h4>
                        <p style="font-size: 12px; color: var(--gray-500);">${d.studentName || 'Öğrenci'} - ${d.date}</p>
                    </div>
                    <span class="badge badge-info">${d.mood || 'Normal'}</span>
                </div>
                <p style="font-size: 14px; color: var(--gray-600);">${d.content}</p>
            </div>
        `).join('');
    },

    showDiaryModal() {
        const content = `
            <form id="diaryForm">
                <div class="form-group">
                    <label>Başlık *</label>
                    <input type="text" name="title" required placeholder="Bugün ne oldu?">
                </div>
                <div class="form-group">
                    <label>Ruh Halim</label>
                    <select name="mood">
                        <option value="Mutlu">Mutlu 😊</option>
                        <option value="Normal">Normal 😐</option>
                        <option value="Üzgün">Üzgün 😢</option>
                        <option value="Heyecanlı">Heyecanlı 🤩</option>
                        <option value="Yorgun">Yorgun 😴</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Günlük *</label>
                    <textarea name="content" rows="5" required placeholder="Bugün neler yaptın? Nasıl hissettin?"></textarea>
                </div>
            </form>
        `;
        this.showModal('Günlük Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: 'App.saveDiary()' }
        ]);
    },

    saveDiary() {
        const form = document.getElementById('diaryForm');
        const formData = new FormData(form);
        const diary = {
            id: this.generateId(),
            studentId: this.currentUser.studentId,
            studentName: this.currentUser.name,
            title: formData.get('title'),
            mood: formData.get('mood'),
            content: formData.get('content'),
            date: new Date().toLocaleDateString('tr-TR')
        };
        if (!this.data.diaries) this.data.diaries = [];
        this.data.diaries.push(diary);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Günlük kaydedildi!');
    },

    renderMyDiary() {
        const studentId = this.currentUser.studentId;
        const diaries = (this.data.diaries || []).filter(d => d.studentId === studentId);
        return `
            <div class="page-header">
                <h1 class="page-title">Günlüğüm</h1>
                <button class="btn btn-primary" onclick="App.showDiaryModal()">
                    <i class="fas fa-plus"></i> Yeni Günlük
                </button>
            </div>
            ${this.renderDiariesList(diaries)}
        `;
    },

    renderMeals() {
        const meals = this.data.meals || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Beslenme Takibi</h1>
                <button class="btn btn-primary" onclick="App.showMealModal()">
                    <i class="fas fa-plus"></i> Kayıt Ekle
                </button>
            </div>

            <div class="search-filter">
                <select id="mealStudent" onchange="App.filterMeals()">
                    <option value="">Tüm Öğrenciler</option>
                    ${this.data.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
            </div>

            <div id="mealsList">
                ${this.renderMealsList(meals)}
            </div>
        `;
    },

    renderMealsList(meals) {
        if (meals.length === 0) return '<p class="empty-state">Henüz kayıt yok</p>';
        return meals.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20).map(m => {
            const student = this.data.students.find(s => s.id === m.studentId);
            return `
                <div class="card" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4>${student?.name || 'Öğrenci'}</h4>
                        <p style="font-size: 12px; color: var(--gray-500);">${m.date}</p>
                    </div>
                    <span class="badge badge-${m.status === 'yes' ? 'success' : m.status === 'no' ? 'danger' : 'warning'}">
                        ${m.status === 'yes' ? 'Yiyecek' : m.status === 'no' ? 'Yemedi' : 'Kısmen'}
                    </span>
                </div>
            `;
        }).join('');
    },

    filterMeals() {
        const studentId = document.getElementById('mealStudent')?.value || '';
        let meals = this.data.meals || [];
        if (studentId) meals = meals.filter(m => m.studentId === studentId);
        document.getElementById('mealsList').innerHTML = this.renderMealsList(meals);
    },

    showMealModal() {
        const content = `
            <form id="mealForm">
                <div class="form-group">
                    <label>Öğrenci *</label>
                    <select name="studentId" required>
                        <option value="">Seçin...</option>
                        ${this.data.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Durum</label>
                    <select name="status">
                        <option value="yes">Yiyecek Getirdi</option>
                        <option value="partial">Kısmen Yedi</option>
                        <option value="no">Yemedi</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Not</label>
                    <textarea name="note" rows="2" placeholder="Örn: Ekmek kaldı, meyve yedi..."></textarea>
                </div>
            </form>
        `;
        this.showModal('Beslenme Kaydı', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: 'App.saveMeal()' }
        ]);
    },

    saveMeal() {
        const form = document.getElementById('mealForm');
        const formData = new FormData(form);
        const meal = {
            id: this.generateId(),
            studentId: formData.get('studentId'),
            status: formData.get('status'),
            note: formData.get('note'),
            date: new Date().toLocaleDateString('tr-TR'),
            recordedBy: this.currentUser.name
        };
        if (!this.data.meals) this.data.meals = [];
        this.data.meals.push(meal);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Kayıt eklendi!');
    },

    renderChildMeals() {
        const studentId = this.currentUser.studentId;
        const meals = (this.data.meals || []).filter(m => m.studentId === studentId);
        return `
            <div class="page-header">
                <h1 class="page-title">Beslenme Takibi</h1>
            </div>
            ${this.renderMealsList(meals)}
        `;
    },

    renderAchievements() {
        const achievements = this.data.achievements || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Başarı Panosu</h1>
                <button class="btn btn-primary" onclick="App.showAchievementModal()">
                    <i class="fas fa-plus"></i> Başarı Ekle
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">🏆 Haftalık En İyiler</span>
                </div>
                ${achievements.length > 0 ? achievements.sort((a, b) => b.points - a.points).slice(0, 10).map((a, i) => {
                    const student = this.data.students.find(s => s.id === a.studentId);
                    return `
                        <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border-bottom: 1px solid var(--gray-200);">
                            <div style="width: 30px; height: 30px; background: ${i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--gray-200)'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${i < 3 ? 'white' : 'var(--gray-500)'}; font-weight: bold;">
                                ${i + 1}
                            </div>
                            <div style="flex: 1;">
                                <h4>${student?.name || 'Öğrenci'}</h4>
                                <p style="font-size: 12px; color: var(--gray-500);">${a.title}</p>
                            </div>
                            <div style="text-align: right;">
                                <span class="badge badge-success">+${a.points} puan</span>
                            </div>
                        </div>
                    `;
                }).join('') : '<p class="empty-state">Henüz başarı eklenmedi</p>'}
            </div>
        `;
    },

    showAchievementModal() {
        const content = `
            <form id="achievementForm">
                <div class="form-group">
                    <label>Öğrenci *</label>
                    <select name="studentId" required>
                        <option value="">Seçin...</option>
                        ${this.data.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Başarı *</label>
                    <input type="text" name="title" required placeholder="örn: Matematik olimpiyatında 1. oldu">
                </div>
                <div class="form-group">
                    <label>Puan</label>
                    <input type="number" name="points" value="10" min="1">
                </div>
            </form>
        `;
        this.showModal('Başarı Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Ekle', class: 'btn-primary', action: 'App.saveAchievement()' }
        ]);
    },

    saveAchievement() {
        const form = document.getElementById('achievementForm');
        const formData = new FormData(form);
        const achievement = {
            id: this.generateId(),
            studentId: formData.get('studentId'),
            title: formData.get('title'),
            points: parseInt(formData.get('points')) || 10,
            date: new Date().toLocaleDateString('tr-TR'),
            recordedBy: this.currentUser.name
        };
        if (!this.data.achievements) this.data.achievements = [];
        this.data.achievements.push(achievement);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Başarı eklendi!');
    },

    renderMyAchievements() {
        const studentId = this.currentUser.studentId;
        const achievements = (this.data.achievements || []).filter(a => a.studentId === studentId);
        const totalPoints = achievements.reduce((a, b) => a + b.points, 0);

        return `
            <div class="page-header">
                <h1 class="page-title">Başarılarım</h1>
            </div>

            <div class="stats-grid" style="margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-icon gold"><i class="fas fa-trophy"></i></div>
                    <div class="stat-info">
                        <h4>${totalPoints}</h4>
                        <p>Toplam Puan</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple"><i class="fas fa-medal"></i></div>
                    <div class="stat-info">
                        <h4>${achievements.length}</h4>
                        <p>Başarı Sayısı</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Başarı Geçmişim</span>
                </div>
                ${achievements.length > 0 ? achievements.sort((a, b) => new Date(b.date) - new Date(a.date)).map(a => `
                    <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--gray-200);">
                        <div>
                            <h4 style="font-size: 14px;">${a.title}</h4>
                            <p style="font-size: 11px; color: var(--gray-400);">${a.date}</p>
                        </div>
                        <span class="badge badge-success">+${a.points} puan</span>
                    </div>
                `).join('') : '<p class="empty-state">Henüz başarı yok</p>'}
            </div>
        `;
    },

    renderBirthdays() {
        const students = this.data.students || [];
        const today = new Date();
        const thisMonth = today.getMonth();

        return `
            <div class="page-header">
                <h1 class="page-title">Doğum Günleri</h1>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">🎂 Bu Ayki Doğum Günleri</span>
                </div>
                ${students.filter(s => {
                    if (!s.birthDate) return false;
                    const month = new Date(s.birthDate).getMonth();
                    return month === thisMonth;
                }).map(s => `
                    <div style="display: flex; align-items: center; gap: 15px; padding: 15px; border-bottom: 1px solid var(--gray-200);">
                        <div class="student-avatar" style="background: linear-gradient(135deg, #ec4899, #db2777);">
                            <i class="fas fa-birthday-cake"></i>
                        </div>
                        <div style="flex: 1;">
                            <h4>${s.name}</h4>
                            <p style="font-size: 12px; color: var(--gray-500);">${new Date(s.birthDate).toLocaleDateString('tr-TR', {day: 'numeric', month: 'long'})}</p>
                        </div>
                    </div>
                `).join('') || '<p class="empty-state">Bu ay doğum günü yok</p>'}
            </div>

            <h3 style="margin-top: 30px; margin-bottom: 15px;">Tüm Doğum Günleri</h3>
            <div class="card">
                ${students.filter(s => s.birthDate).sort((a, b) => new Date(a.birthDate).getMonth() - new Date(b.birthDate).getMonth()).map(s => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--gray-200);">
                        <span>${s.name}</span>
                        <span style="color: var(--gray-500);">${new Date(s.birthDate).toLocaleDateString('tr-TR', {day: 'numeric', month: 'long'})}</span>
                    </div>
                `).join('') || '<p class="empty-state">Doğum günü bilgisi yok</p>'}
            </div>
        `;
    },

    renderMyBirthday() {
        const studentId = this.currentUser.studentId;
        const student = this.data.students.find(s => s.id === studentId);

        return `
            <div class="page-header">
                <h1 class="page-title">Doğum Günüm 🎂</h1>
            </div>

            <div class="card" style="text-align: center; max-width: 400px; margin: 0 auto;">
                <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #ec4899, #db2777); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 40px;">
                    <i class="fas fa-birthday-cake"></i>
                </div>
                <h2>${this.currentUser.name}</h2>
                <p style="font-size: 24px; color: var(--primary); margin: 15px 0;">
                    ${student?.birthDate ? new Date(student.birthDate).toLocaleDateString('tr-TR', {day: 'numeric', month: 'long'}) : 'Bilgi yok'}
                </p>
                <p style="color: var(--gray-500);">${this.getDaysUntilBirthday(student?.birthDate)}</p>
            </div>
        `;
    },

    getDaysUntilBirthday(birthDate) {
        if (!birthDate) return '';
        const today = new Date();
        const birth = new Date(birthDate);
        birth.setFullYear(today.getFullYear());
        if (birth < today) birth.setFullYear(today.getFullYear() + 1);
        const days = Math.ceil((birth - today) / (1000 * 60 * 60 * 24));
        if (days === 0) return '🎉 Bugün doğum günün!';
        if (days === 1) return '🎈 Yarın doğum günün!';
        return `${days} gün sonra doğum günün!`;
    },

    renderTournaments() {
        const tournaments = this.data.tournaments || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Spor Turnuvaları</h1>
                <button class="btn btn-primary" onclick="App.showTournamentModal()">
                    <i class="fas fa-plus"></i> Turnuva Ekle
                </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                ${tournaments.length > 0 ? tournaments.map(t => `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h4>${t.title}</h4>
                            <span class="badge badge-${t.status === 'active' ? 'success' : t.status === 'completed' ? 'info' : 'warning'}">
                                ${t.status === 'active' ? 'Aktif' : t.status === 'completed' ? 'Tamamlandı' : 'Yaklaşan'}
                            </span>
                        </div>
                        <p style="font-size: 13px; color: var(--gray-500); margin-bottom: 10px;">${t.description || ''}</p>
                        <div style="display: flex; gap: 10px; font-size: 12px; color: var(--gray-400);">
                            <span><i class="fas fa-calendar"></i> ${t.date}</span>
                            <span><i class="fas fa-users"></i> ${t.participants?.length || 0} katılımcı</span>
                        </div>
                    </div>
                `).join('') : '<p class="empty-state">Henüz turnuva yok</p>'}
            </div>
        `;
    },

    showTournamentModal() {
        const content = `
            <form id="tournamentForm">
                <div class="form-group">
                    <label>Turnuva Adı *</label>
                    <input type="text" name="title" required placeholder="örn: Futbol Turnuvası">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tarih</label>
                        <input type="date" name="date">
                    </div>
                    <div class="form-group">
                        <label>Durum</label>
                        <select name="status">
                            <option value="upcoming">Yaklaşan</option>
                            <option value="active">Aktif</option>
                            <option value="completed">Tamamlandı</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="3"></textarea>
                </div>
            </form>
        `;
        this.showModal('Turnuva Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Ekle', class: 'btn-primary', action: 'App.saveTournament()' }
        ]);
    },

    saveTournament() {
        const form = document.getElementById('tournamentForm');
        const formData = new FormData(form);
        const tournament = {
            id: this.generateId(),
            title: formData.get('title'),
            date: formData.get('date'),
            status: formData.get('status'),
            description: formData.get('description'),
            participants: [],
            createdBy: this.currentUser.name
        };
        if (!this.data.tournaments) this.data.tournaments = [];
        this.data.tournaments.push(tournament);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Turnuva eklendi!');
    },

    renderMyTournaments() { return this.renderTournaments(); },

    renderGallery() {
        const galleries = this.data.galleries || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Galeri</h1>
                <button class="btn btn-primary" onclick="App.showGalleryModal()">
                    <i class="fas fa-plus"></i> Fotoğraf Ekle
                </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                ${galleries.length > 0 ? galleries.map(g => `
                    <div class="card" style="padding: 10px; text-align: center;">
                        <div style="width: 100%; height: 150px; background: var(--gray-100); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; overflow: hidden;">
                            ${g.image ? `<img src="${g.image}" style="max-width: 100%; max-height: 100%; object-fit: cover;">` : '<i class="fas fa-image" style="font-size: 48px; color: var(--gray-300);"></i>'}
                        </div>
                        <h4 style="font-size: 14px;">${g.title}</h4>
                        <p style="font-size: 11px; color: var(--gray-500);">${g.date}</p>
                    </div>
                `).join('') : '<p class="empty-state">Galeri boş</p>'}
            </div>
        `;
    },

    showGalleryModal() {
        const content = `
            <form id="galleryForm">
                <div class="form-group">
                    <label>Başlık *</label>
                    <input type="text" name="title" required placeholder="Fotoğraf başlığı">
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="2"></textarea>
                </div>
            </form>
        `;
        this.showModal('Fotoğraf Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Ekle', class: 'btn-primary', action: 'App.saveGallery()' }
        ]);
    },

    saveGallery() {
        const form = document.getElementById('galleryForm');
        const formData = new FormData(form);
        const gallery = {
            id: this.generateId(),
            title: formData.get('title'),
            description: formData.get('description'),
            date: new Date().toLocaleDateString('tr-TR'),
            uploadedBy: this.currentUser.name
        };
        if (!this.data.galleries) this.data.galleries = [];
        this.data.galleries.push(gallery);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Fotoğraf eklendi!');
    },

    renderMyGallery() { return this.renderGallery(); },

    renderQuote() {
        const quotes = this.data.quotes || [];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)] || 'Başarı, azimle gelir!';

        return `
            <div class="page-header">
                <h1 class="page-title">Günün Sözü</h1>
            </div>

            <div class="card" style="max-width: 600px; margin: 50px auto; text-align: center; padding: 50px;">
                <i class="fas fa-quote-left" style="font-size: 48px; color: var(--primary); opacity: 0.3; margin-bottom: 20px;"></i>
                <p style="font-size: 24px; font-style: italic; color: var(--dark); line-height: 1.6; margin-bottom: 30px;">
                    "${randomQuote}"
                </p>
                <button class="btn btn-secondary" onclick="App.renderPage('quote')">
                    <i class="fas fa-sync-alt"></i> Yeni Söz
                </button>
            </div>
        `;
    },

    renderGames() {
        return `
            <div class="page-header">
                <h1 class="page-title">Zeka Oyunları</h1>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                <div class="card" style="text-align: center; cursor: pointer;" onclick="App.playMathGame()">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 32px;">
                        <i class="fas fa-calculator"></i>
                    </div>
                    <h3>Matematik Oyunu</h3>
                    <p style="color: var(--gray-500); font-size: 13px;">Hızlı matematik soruları</p>
                </div>

                <div class="card" style="text-align: center; cursor: pointer;" onclick="App.playWordGame()">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 32px;">
                        <i class="fas fa-spell-check"></i>
                    </div>
                    <h3>Kelime Oyunu</h3>
                    <p style="color: var(--gray-500); font-size: 13px;">Kelime bilginizi test edin</p>
                </div>

                <div class="card" style="text-align: center; cursor: pointer;" onclick="App.playMemoryGame()">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-size: 32px;">
                        <i class="fas fa-brain"></i>
                    </div>
                    <h3>Hafıza Oyunu</h3>
                    <p style="color: var(--gray-500); font-size: 13px;">Eşleştirme oyunu</p>
                </div>
            </div>

            <div id="gameArea" style="margin-top: 30px;"></div>
        `;
    },

    playMathGame() {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operators = ['+', '-', '*'];
        const op = operators[Math.floor(Math.random() * operators.length)];
        let answer;
        switch(op) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '*': answer = num1 * num2; break;
        }

        const content = `
            <div style="text-align: center; padding: 30px;">
                <h2 style="margin-bottom: 30px;">${num1} ${op} ${num2} = ?</h2>
                <input type="number" id="mathAnswer" style="padding: 15px; font-size: 24px; text-align: center; width: 150px; border: 2px solid var(--primary); border-radius: 8px;">
                <button class="btn btn-primary" onclick="App.checkMathAnswer(${answer})" style="margin-left: 10px;">Kontrol Et</button>
                <div id="mathResult" style="margin-top: 20px; font-size: 18px;"></div>
            </div>
        `;
        document.getElementById('gameArea').innerHTML = content;
    },

    checkMathAnswer(correct) {
        const userAnswer = parseInt(document.getElementById('mathAnswer').value);
        const result = document.getElementById('mathResult');
        if (userAnswer === correct) {
            result.innerHTML = '<span style="color: green;">Doğru! 🎉</span>';
        } else {
            result.innerHTML = `<span style="color: red;">Yanlış! Doğru cevap: ${correct}</span>`;
        }
    },

    playWordGame() {
        const words = ['EDEBİYAT', 'MATEMATİK', 'FEN BİLİMLERİ', 'SOSYAL', 'TÜRKÇE', 'İNGİLİZCE'];
        const word = words[Math.floor(Math.random() * words.length)];
        const hint = word[0] + '_'.repeat(word.length - 1);

        const content = `
            <div style="text-align: center; padding: 30px;">
                <h2>Kelime Oyunu</h2>
                <p style="font-size: 14px; color: var(--gray-500); margin-bottom: 20px;">Ders adını tahmin edin</p>
                <p style="font-size: 36px; letter-spacing: 8px; margin-bottom: 20px;">${hint}</p>
                <input type="text" id="wordAnswer" style="padding: 15px; font-size: 18px; text-align: center; text-transform: uppercase;" placeholder="Tahmininiz">
                <button class="btn btn-primary" onclick="App.checkWordAnswer('${word}')" style="margin-left: 10px;">Tahmin Et</button>
                <div id="wordResult" style="margin-top: 20px; font-size: 18px;"></div>
            </div>
        `;
        document.getElementById('gameArea').innerHTML = content;
    },

    checkWordAnswer(correct) {
        const userAnswer = document.getElementById('wordAnswer').value.toUpperCase();
        const result = document.getElementById('wordResult');
        if (userAnswer === correct) {
            result.innerHTML = '<span style="color: green;">Doğru! 🎉</span>';
        } else {
            result.innerHTML = '<span style="color: red;">Yanlış! Tekrar deneyin.</span>';
        }
    },

    playMemoryGame() {
        const content = `
            <div style="text-align: center; padding: 30px;">
                <h2>Hafıza Oyunu</h2>
                <p style="color: var(--gray-500); margin-bottom: 20px;">Yakında...</p>
                <div style="display: grid; grid-template-columns: repeat(4, 80px); gap: 10px; justify-content: center;">
                    ${Array(8).fill(0).map((_, i) => `
                        <div style="width: 80px; height: 80px; background: var(--primary); border-radius: 8px; cursor: pointer;" onclick="this.style.background='var(--secondary)';">
                            ?
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.getElementById('gameArea').innerHTML = content;
    },

    renderLoginLogs() {
        const logs = (this.data.loginLogs || []).sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 50);

        return `
            <div class="page-header">
                <h1 class="page-title">Giriş Logları</h1>
                <button class="btn btn-secondary" onclick="App.exportLoginLogs()">
                    <i class="fas fa-download"></i> Dışa Aktar
                </button>
            </div>

            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Kullanıcı</th>
                                <th>Rol</th>
                                <th>İşlem</th>
                                <th>Tarih/Saat</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logs.map(log => `
                                <tr>
                                    <td>${log.user}</td>
                                    <td><span class="badge badge-info">${this.getRoleName(log.role)}</span></td>
                                    <td><span class="badge badge-${log.action === 'login' ? 'success' : 'warning'}">${log.action}</span></td>
                                    <td>${new Date(log.time).toLocaleString('tr-TR')}</td>
                                </tr>
                            `).join('') || '<tr><td colspan="4" style="text-align: center;">Log yok</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    exportLoginLogs() {
        const logs = this.data.loginLogs || [];
        const dataStr = JSON.stringify(logs, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `login-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        this.showToast('Loglar dışa aktarıldı!');
    },

    applyTheme() {
        const theme = this.data.settings?.theme || 'default';
        document.body.className = '';
        if (theme === 'dark') document.body.classList.add('dark-mode');
        if (theme === 'newyear') document.body.classList.add('theme-newyear');
        if (theme === 'april23') document.body.classList.add('theme-april23');
        localStorage.setItem('theme', theme);
    },

    renderPolls() {
        const polls = this.data.polls || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Sınıf Anketleri</h1>
                <button class="btn btn-primary" onclick="App.showPollModal()">
                    <i class="fas fa-plus"></i> Anket Oluştur
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Aktif Anketler</span>
                </div>
                ${polls.filter(p => !p.closed).length > 0 ? polls.filter(p => !p.closed).map(p => this.renderPollCard(p)).join('') : '<p class="empty-state">Aktif anket yok</p>'}
            </div>

            <h3 style="margin-top: 30px; margin-bottom: 15px;">Tamamlanan Anketler</h3>
            <div class="card">
                ${polls.filter(p => p.closed).length > 0 ? polls.filter(p => p.closed).map(p => this.renderPollCard(p)).join('') : '<p class="empty-state">Tamamlanan anket yok</p>'}
            </div>
        `;
    },

    renderPollCard(poll) {
        const totalVotes = poll.options.reduce((a, o) => a + (o.votes || 0), 0);
        const userVoted = poll.voted?.includes(this.currentUser?.id);

        return `
            <div style="padding: 20px; border-bottom: 1px solid var(--gray-200);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4>${poll.title}</h4>
                    <span class="badge badge-${poll.closed ? 'info' : 'success'}">${poll.closed ? 'Kapalı' : 'Aktif'}</span>
                </div>
                <p style="color: var(--gray-500); font-size: 13px; margin-bottom: 15px;">${poll.description || ''}</p>
                ${!poll.closed && !userVoted ? `
                    ${poll.options.map((opt, i) => `
                        <div style="margin-bottom: 10px;">
                            <button class="btn btn-secondary" onclick="App.votePoll('${poll.id}', ${i})" style="width: 100%; text-align: left;">
                                <i class="fas fa-circle"></i> ${opt.text}
                            </button>
                        </div>
                    `).join('')}
                ` : `
                    ${poll.options.map(opt => {
                        const percent = totalVotes > 0 ? ((opt.votes || 0) / totalVotes * 100).toFixed(0) : 0;
                        return `
                            <div style="margin-bottom: 10px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>${opt.text}</span>
                                    <span>${percent}% (${opt.votes || 0} oy)</span>
                                </div>
                                <div style="height: 20px; background: var(--gray-200); border-radius: 10px; overflow: hidden;">
                                    <div style="height: 100%; width: ${percent}%; background: var(--primary); border-radius: 10px; transition: width 0.5s;"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                `}
                <p style="font-size: 12px; color: var(--gray-400); margin-top: 10px;">Toplam ${totalVotes} oy | Oluşturan: ${poll.createdBy}</p>
            </div>
        `;
    },

    showPollModal() {
        const content = `
            <form id="pollForm">
                <div class="form-group">
                    <label>Soru *</label>
                    <input type="text" name="title" required placeholder="Anket sorusu">
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label>Seçenekler * (her satıra bir seçenek)</label>
                    <textarea name="options" rows="4" required placeholder="Seçenek 1&#10;Seçenek 2&#10;Seçenek 3"></textarea>
                </div>
            </form>
        `;
        this.showModal('Anket Oluştur', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Oluştur', class: 'btn-primary', action: 'App.savePoll()' }
        ]);
    },

    savePoll() {
        const form = document.getElementById('pollForm');
        const formData = new FormData(form);
        const options = formData.get('options').split('\n').filter(o => o.trim()).map(text => ({ text: text.trim(), votes: 0 }));
        const poll = {
            id: this.generateId(),
            title: formData.get('title'),
            description: formData.get('description'),
            options: options,
            voted: [],
            closed: false,
            createdBy: this.currentUser.name,
            createdAt: new Date().toISOString()
        };
        if (!this.data.polls) this.data.polls = [];
        this.data.polls.push(poll);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Anket oluşturuldu!');
    },

    votePoll(pollId, optionIndex) {
        const poll = this.data.polls.find(p => p.id === pollId);
        if (poll && !poll.voted.includes(this.currentUser?.id)) {
            poll.options[optionIndex].votes++;
            poll.voted.push(this.currentUser?.id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Oyunuz kaydedildi!');
        }
    },

    renderReminders() {
        const reminders = this.data.reminders || [];
        const now = new Date();
        return `
            <div class="page-header">
                <h1 class="page-title">Hatırlatıcılar</h1>
                <button class="btn btn-primary" onclick="App.showReminderModal()">
                    <i class="fas fa-plus"></i> Hatırlatıcı Ekle
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Yaklaşan Hatırlatıcılar</span>
                </div>
                ${reminders.filter(r => new Date(r.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date)).length > 0 
                    ? reminders.filter(r => new Date(r.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date)).map(r => this.renderReminderCard(r)).join('')
                    : '<p class="empty-state">Yaklaşan hatırlatıcı yok</p>'}
            </div>

            <h3 style="margin-top: 30px; margin-bottom: 15px;">Geçmiş Hatırlatıcılar</h3>
            <div class="card">
                ${reminders.filter(r => new Date(r.date) < now).length > 0 
                    ? reminders.filter(r => new Date(r.date) < now).map(r => this.renderReminderCard(r)).join('')
                    : '<p class="empty-state">Geçmiş hatırlatıcı yok</p>'}
            </div>
        `;
    },

    renderReminderCard(reminder) {
        const isPast = new Date(reminder.date) < new Date();
        return `
            <div style="padding: 15px; border-bottom: 1px solid var(--gray-200); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: ${isPast ? 'var(--gray-400)' : 'inherit'};">${reminder.title}</h4>
                    <p style="font-size: 12px; color: var(--gray-500);">${reminder.date} - ${reminder.time || ''}</p>
                </div>
                <button class="action-btn delete" onclick="App.deleteReminder('${reminder.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    },

    showReminderModal() {
        const content = `
            <form id="reminderForm">
                <div class="form-group">
                    <label>Başlık *</label>
                    <input type="text" name="title" required placeholder="Hatırlatıcı başlığı">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tarih *</label>
                        <input type="date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label>Saat</label>
                        <input type="time" name="time" value="09:00">
                    </div>
                </div>
            </form>
        `;
        this.showModal('Hatırlatıcı Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Ekle', class: 'btn-primary', action: 'App.saveReminder()' }
        ]);
    },

    saveReminder() {
        const form = document.getElementById('reminderForm');
        const formData = new FormData(form);
        const reminder = {
            id: this.generateId(),
            title: formData.get('title'),
            date: formData.get('date'),
            time: formData.get('time'),
            createdBy: this.currentUser.name
        };
        if (!this.data.reminders) this.data.reminders = [];
        this.data.reminders.push(reminder);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Hatırlatıcı eklendi!');
    },

    deleteReminder(id) {
        if (confirm('Hatırlatıcıyı silmek istediğinize emin misiniz?')) {
            this.data.reminders = this.data.reminders.filter(r => r.id !== id);
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast('Hatırlatıcı silindi!');
        }
    },

    renderStudyTopics() {
        const topics = this.data.studyTopics || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Sınav Hazırlık</h1>
                <button class="btn btn-primary" onclick="App.showStudyTopicModal()">
                    <i class="fas fa-plus"></i> Konu Ekle
                </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
                ${topics.length > 0 ? topics.map(t => `
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h4>${t.title}</h4>
                            <span class="badge badge-${t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'info'}">${t.subject || 'Genel'}</span>
                        </div>
                        <p style="font-size: 13px; color: var(--gray-500); margin-bottom: 10px;">${t.description || ''}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 11px; color: var(--gray-400);"><i class="fas fa-calendar"></i> ${t.deadline || 'Belirtilmedi'}</span>
                            <button class="btn btn-sm" onclick="App.toggleStudyTopic('${t.id}')">
                                <i class="fas ${t.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                            </button>
                        </div>
                    </div>
                `).join('') : '<p class="empty-state">Henüz konu eklenmedi</p>'}
            </div>
        `;
    },

    showStudyTopicModal() {
        const content = `
            <form id="studyForm">
                <div class="form-group">
                    <label>Konu Adı *</label>
                    <input type="text" name="title" required placeholder="Çalışılacak konu">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Ders</label>
                        <select name="subject">
                            <option value="">Seçin...</option>
                            ${[...new Set(this.data.grades.map(g => g.subject))].map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Öncelik</label>
                        <select name="priority">
                            <option value="low">Düşük</option>
                            <option value="medium">Orta</option>
                            <option value="high">Yüksek</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <textarea name="description" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label>Bitiş Tarihi</label>
                    <input type="date" name="deadline">
                </div>
            </form>
        `;
        this.showModal('Konu Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Ekle', class: 'btn-primary', action: 'App.saveStudyTopic()' }
        ]);
    },

    saveStudyTopic() {
        const form = document.getElementById('studyForm');
        const formData = new FormData(form);
        const topic = {
            id: this.generateId(),
            title: formData.get('title'),
            subject: formData.get('subject'),
            priority: formData.get('priority'),
            description: formData.get('description'),
            deadline: formData.get('deadline'),
            completed: false,
            createdBy: this.currentUser.name
        };
        if (!this.data.studyTopics) this.data.studyTopics = [];
        this.data.studyTopics.push(topic);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Konu eklendi!');
    },

    toggleStudyTopic(id) {
        const topic = this.data.studyTopics.find(t => t.id === id);
        if (topic) {
            topic.completed = !topic.completed;
            this.saveData();
            this.renderPage(this.currentPage);
            this.showToast(topic.completed ? 'Tamamlandı!' : 'Geri alındı');
        }
    },

    renderMyStudyTopics() {
        const topics = (this.data.studyTopics || []).filter(t => !t.completed);
        const completed = (this.data.studyTopics || []).filter(t => t.completed);
        return `
            <div class="page-header">
                <h1 class="page-title">Çalışma Listem</h1>
            </div>

            <div class="card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-book"></i> Çalışılacak Konular (${topics.length})</span>
                </div>
                ${topics.length > 0 ? topics.map(t => `
                    <div style="padding: 12px; border-bottom: 1px solid var(--gray-200); display: flex; align-items: center; gap: 15px;">
                        <button class="btn btn-sm" onclick="App.toggleStudyTopic('${t.id}')" style="width: 40px; height: 40px;">
                            <i class="far fa-circle" style="font-size: 20px;"></i>
                        </button>
                        <div style="flex: 1;">
                            <h4 style="margin-bottom: 3px;">${t.title}</h4>
                            <p style="font-size: 12px; color: var(--gray-500);">${t.subject || 'Genel'} - ${t.deadline || ''}</p>
                        </div>
                        <span class="badge badge-${t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'info'}">${t.priority}</span>
                    </div>
                `).join('') : '<p class="empty-state">Tüm konular tamamlandı! 🎉</p>'}
            </div>

            ${completed.length > 0 ? `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-check-circle"></i> Tamamlananlar (${completed.length})</span>
                </div>
                ${completed.map(t => `
                    <div style="padding: 10px; border-bottom: 1px solid var(--gray-200); color: var(--gray-400); text-decoration: line-through;">
                        ${t.title}
                    </div>
                `).join('')}
            </div>
            ` : ''}
        `;
    },

    renderMeetingNotes() {
        const meetings = this.data.parentMeetings || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Toplantı Notları</h1>
                <button class="btn btn-primary" onclick="App.showMeetingNoteModal()">
                    <i class="fas fa-plus"></i> Not Ekle
                </button>
            </div>

            <div class="card">
                ${meetings.length > 0 ? meetings.sort((a, b) => new Date(b.date) - new Date(a.date)).map(m => `
                    <div style="padding: 20px; border-bottom: 1px solid var(--gray-200);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <h4>${m.title}</h4>
                            <span class="badge badge-info">${m.date || ''}</span>
                        </div>
                        <p style="color: var(--gray-600); font-size: 14px; line-height: 1.6;">${m.notes || ''}</p>
                        <p style="font-size: 12px; color: var(--gray-400); margin-top: 10px;">Not: ${m.noteTaker || ''}</p>
                    </div>
                `).join('') : '<p class="empty-state">Henüz toplantı notu yok</p>'}
            </div>
        `;
    },

    showMeetingNoteModal() {
        const meetings = this.data.parentMeetings || [];
        const content = `
            <form id="noteForm">
                <div class="form-group">
                    <label>Toplantı</label>
                    <select name="meetingId" onchange="App.fillMeetingNote(this.value)">
                        <option value="">Yeni toplantı notu</option>
                        ${meetings.map(m => `<option value="${m.id}">${m.title} - ${m.date || ''}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Toplantı Adı *</label>
                    <input type="text" name="title" required placeholder="Toplantı adı">
                </div>
                <div class="form-group">
                    <label>Tarih</label>
                    <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Notlar *</label>
                    <textarea name="notes" rows="6" required placeholder="Toplantıda konuşulan önemli noktalar..."></textarea>
                </div>
            </form>
        `;
        this.showModal('Toplantı Notu Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Kaydet', class: 'btn-primary', action: 'App.saveMeetingNote()' }
        ]);
    },

    fillMeetingNote(id) {
        if (id) {
            const meeting = this.data.parentMeetings.find(m => m.id === id);
            if (meeting) {
                document.querySelector('[name="title"]').value = meeting.title;
                document.querySelector('[name="date"]').value = meeting.date || '';
            }
        }
    },

    saveMeetingNote() {
        const form = document.getElementById('noteForm');
        const formData = new FormData(form);
        const note = {
            id: this.generateId(),
            title: formData.get('title'),
            date: formData.get('date'),
            notes: formData.get('notes'),
            noteTaker: this.currentUser.name
        };
        this.data.parentMeetings.push(note);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Not kaydedildi!');
    },

    renderExamAnalysis() {
        const exams = this.data.trialExams || [];
        const results = this.data.trialResults || [];

        return `
            <div class="page-header">
                <h1 class="page-title">Sınav Analizi Detaylı</h1>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
                ${exams.map(exam => {
                    const examResults = results.filter(r => r.examId === exam.id);
                    const avgNet = examResults.length > 0 
                        ? (examResults.reduce((a, r) => a + (parseFloat(r.totalNet) || 0), 0) / examResults.length).toFixed(1)
                        : '-';
                    const avgCorrect = examResults.length > 0
                        ? (examResults.reduce((a, r) => a + (parseFloat(r.totalCorrect) || 0), 0) / examResults.length).toFixed(1)
                        : '-';

                    return `
                        <div class="card">
                            <h4 style="margin-bottom: 10px;">${exam.name}</h4>
                            <p style="font-size: 12px; color: var(--gray-500); margin-bottom: 15px;">${exam.date}</p>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <div style="text-align: center; padding: 15px; background: var(--gray-100); border-radius: 8px;">
                                    <div style="font-size: 24px; font-weight: bold; color: var(--primary);">${avgNet}</div>
                                    <div style="font-size: 11px; color: var(--gray-500);">Ortalama Net</div>
                                </div>
                                <div style="text-align: center; padding: 15px; background: var(--gray-100); border-radius: 8px;">
                                    <div style="font-size: 24px; font-weight: bold; color: var(--secondary);">${avgCorrect}</div>
                                    <div style="font-size: 11px; color: var(--gray-500);">Doğru Ort.</div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('') || '<p class="empty-state">Henüz sınav yok</p>'}
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-title">Ders Bazlı Performans</span>
                </div>
                ${exams.length > 0 ? `
                    <div style="padding: 20px;">
                        ${['Turkce', 'Matematik', 'Fen', 'Sosyal', 'Ingilizce'].map(subject => {
                            const subjectResults = results.filter(r => r.subject === subject);
                            const avg = subjectResults.length > 0 
                                ? (subjectResults.reduce((a, r) => a + (parseFloat(r.net) || 0), 0) / subjectResults.length).toFixed(1)
                                : '-';
                            const percent = parseFloat(avg) || 0;
                            return `
                                <div style="margin-bottom: 15px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                        <span>${subject}</span>
                                        <span>${avg} net</span>
                                    </div>
                                    <div style="height: 10px; background: var(--gray-200); border-radius: 5px; overflow: hidden;">
                                        <div style="height: 100%; width: ${Math.min(percent * 10, 100)}%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 5px;"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : '<p class="empty-state">Analiz için sınav verisi yok</p>'}
            </div>
        `;
    },

    renderStudentProfile() {
        const studentId = this.currentUser?.role === 'student' ? this.currentUser.studentId : null;
        return `
            <div class="page-header">
                <h1 class="page-title">Öğrenci Profili</h1>
            </div>

            <div class="search-filter" style="margin-bottom: 20px;">
                <select id="profileStudent" onchange="App.loadStudentProfile(this.value)">
                    <option value="">Öğrenci seçin...</option>
                    ${this.data.students.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
            </div>

            <div id="profileContent">
                <p class="empty-state">Öğrenci seçin</p>
            </div>
        `;
    },

    loadStudentProfile(id) {
        if (!id) return;
        const student = this.data.students.find(s => s.id === id);
        const grades = (this.data.grades || []).filter(g => g.studentId === id);
        const attendance = (this.data.attendance || []).filter(a => a.studentId === id);
        const badges = (this.data.badges || []).filter(b => b.studentId === id);
        const stars = (this.data.starPoints || []).filter(s => s.studentId === id);
        const behaviors = (this.data.behaviors || []).filter(b => b.studentId === id);

        const avgGrade = grades.length > 0 
            ? (grades.reduce((a, g) => a + parseFloat(g.score), 0) / grades.length).toFixed(1)
            : '-';
        const totalStars = stars.reduce((a, s) => a + (parseInt(s.points) || 0), 0);

        const content = `
            <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px;">
                <div class="card">
                    <div style="text-align: center; padding: 20px;">
                        <div style="width: 120px; height: 120px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;">
                            <i class="fas fa-user"></i>
                        </div>
                        <h3>${student.name}</h3>
                        <p style="color: var(--gray-500);">No: ${student.number}</p>
                        <p style="color: var(--gray-500);">${student.gender === 'male' ? 'Erkek' : 'Kız'}</p>
                    </div>

                    <div style="border-top: 1px solid var(--gray-200); padding: 20px;">
                        <h4 style="margin-bottom: 15px;">İstatistikler</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: var(--primary);">${avgGrade}</div>
                                <div style="font-size: 11px; color: var(--gray-500);">Ortalama</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${totalStars}</div>
                                <div style="font-size: 11px; color: var(--gray-500);">Yıldız</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: var(--secondary);">${badges.length}</div>
                                <div style="font-size: 11px; color: var(--gray-500);">Rozet</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: var(--danger);">${attendance.filter(a => a.status === 'absent').length}</div>
                                <div style="font-size: 11px; color: var(--gray-500);">Devamsızlık</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display: grid; gap: 20px;">
                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">Son Notlar</span>
                        </div>
                        ${grades.slice(-10).reverse().map(g => `
                            <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--gray-100);">
                                <span>${g.subject}</span>
                                <span class="badge ${parseFloat(g.score) >= 50 ? 'badge-success' : 'badge-danger'}">${g.score}</span>
                            </div>
                        `).join('') || '<p class="empty-state">Not yok</p>'}
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">Davranış Geçmişi</span>
                        </div>
                        ${behaviors.slice(-5).reverse().map(b => `
                            <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--gray-100);">
                                <span style="font-size: 13px;">${b.note}</span>
                                <span class="badge badge-${b.type === 'positive' ? 'success' : b.type === 'negative' ? 'danger' : 'warning'}">${b.type === 'positive' ? '+' : b.type === 'negative' ? '-' : '~'}</span>
                            </div>
                        `).join('') || '<p class="empty-state">Kayıt yok</p>'}
                    </div>
                </div>
            </div>
        `;
        document.getElementById('profileContent').innerHTML = content;
    },

    renderMyProfile() {
        const studentId = this.currentUser.studentId;
        const student = this.data.students.find(s => s.id === studentId);
        const grades = (this.data.grades || []).filter(g => g.studentId === studentId);
        const totalStars = (this.data.starPoints || []).filter(s => s.studentId === studentId).reduce((a, s) => a + (parseInt(s.points) || 0), 0);
        const badges = (this.data.badges || []).filter(b => b.studentId === studentId);

        const avgGrade = grades.length > 0 
            ? (grades.reduce((a, g) => a + parseFloat(g.score), 0) / grades.length).toFixed(1)
            : '-';

        return `
            <div class="page-header">
                <h1 class="page-title">Profilim</h1>
            </div>

            <div style="display: grid; grid-template-columns: 300px 1fr; gap: 20px;">
                <div class="card">
                    <div style="text-align: center; padding: 30px;">
                        <div style="width: 120px; height: 120px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;">
                            ${this.currentUser.name.charAt(0)}
                        </div>
                        <h2>${this.currentUser.name}</h2>
                        <p style="color: var(--gray-500);">Öğrenci</p>
                        <p style="color: var(--gray-400); font-size: 13px;">${this.data.settings.className || 'Sınıf'}</p>
                    </div>

                    <div style="border-top: 1px solid var(--gray-200); padding: 20px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                            <div style="text-align: center; padding: 15px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 12px; color: white;">
                                <div style="font-size: 28px; font-weight: bold;">${avgGrade}</div>
                                <div style="font-size: 11px;">Ortalama</div>
                            </div>
                            <div style="text-align: center; padding: 15px; background: #fef3c7; border-radius: 12px;">
                                <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">${totalStars}</div>
                                <div style="font-size: 11px; color: #92400e;">Yıldız</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="card" style="margin-bottom: 20px;">
                        <div class="card-header">
                            <span class="card-title">Rozetlerim</span>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; padding: 10px;">
                            ${badges.length > 0 ? badges.map(b => `
                                <div style="padding: 15px; background: #f3e8ff; border-radius: 12px; text-align: center; min-width: 80px;">
                                    <i class="fas fa-award" style="font-size: 24px; color: #a855f7;"></i>
                                    <div style="font-size: 11px; margin-top: 5px;">${b.name || 'Rozet'}</div>
                                </div>
                            `).join('') : '<p class="empty-state">Henüz rozet yok</p>'}
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <span class="card-title">Son Notlarım</span>
                        </div>
                        ${grades.slice(-5).reverse().map(g => `
                            <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--gray-100);">
                                <span>${g.subject}</span>
                                <span class="badge ${parseFloat(g.score) >= 50 ? 'badge-success' : 'badge-danger'}">${g.score}</span>
                            </div>
                        `).join('') || '<p class="empty-state">Henüz not yok</p>'}
                    </div>
                </div>
            </div>
        `;
    },

    renderBadgeDesign() {
        const settings = this.data.badgeSettings || [];
        return `
            <div class="page-header">
                <h1 class="page-title">Rozet Tasarımları</h1>
                <button class="btn btn-primary" onclick="App.showBadgeDesignModal()">
                    <i class="fas fa-plus"></i> Rozet Ekle
                </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                ${settings.length > 0 ? settings.map(b => `
                    <div class="card" style="text-align: center;">
                        <div style="width: 80px; height: 80px; background: ${b.color || '#a855f7'}; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">
                            <i class="fas ${b.icon || 'fa-award'}"></i>
                        </div>
                        <h4>${b.name}</h4>
                        <p style="font-size: 12px; color: var(--gray-500);">${b.description || ''}</p>
                        <p style="font-size: 11px; color: var(--gray-400);">Puan: ${b.points || 0}</p>
                    </div>
                `).join('') : '<p class="empty-state">Henüz rozet tasarımı yok</p>'}
            </div>
        `;
    },

    showBadgeDesignModal() {
        const content = `
            <form id="badgeDesignForm">
                <div class="form-group">
                    <label>Rozet Adı *</label>
                    <input type="text" name="name" required placeholder="örn: Kitap Kurdu">
                </div>
                <div class="form-group">
                    <label>Açıklama</label>
                    <input type="text" name="description" placeholder="Rozet açıklaması">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>İkon</label>
                        <select name="icon">
                            <option value="fa-star">Yıldız</option>
                            <option value="fa-book">Kitap</option>
                            <option value="fa-trophy">Kupa</option>
                            <option value="fa-medal">Madalya</option>
                            <option value="fa-heart">Kalp</option>
                            <option value="fa-bolt">Şimşek</option>
                            <option value="fa-brain">Beyin</option>
                            <option value="fa-graduation-cap">Kep</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Renk</label>
                        <select name="color">
                            <option value="#a855f7">Mor</option>
                            <option value="#ef4444">Kırmızı</option>
                            <option value="#10b981">Yeşil</option>
                            <option value="#f59e0b">Turuncu</option>
                            <option value="#3b82f6">Mavi</option>
                            <option value="#ec4899">Pembe</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Puan</label>
                    <input type="number" name="points" value="10" min="0">
                </div>
            </form>
        `;
        this.showModal('Rozet Tasarımı Ekle', content, [
            { text: 'İptal', action: 'App.closeModal()' },
            { text: 'Ekle', class: 'btn-primary', action: 'App.saveBadgeDesign()' }
        ]);
    },

    saveBadgeDesign() {
        const form = document.getElementById('badgeDesignForm');
        const formData = new FormData(form);
        const badge = {
            id: this.generateId(),
            name: formData.get('name'),
            description: formData.get('description'),
            icon: formData.get('icon'),
            color: formData.get('color'),
            points: parseInt(formData.get('points')) || 10
        };
        if (!this.data.badgeSettings) this.data.badgeSettings = [];
        this.data.badgeSettings.push(badge);
        this.saveData();
        this.closeModal();
        this.renderPage(this.currentPage);
        this.showToast('Rozet tasarımı eklendi!');
    },

    renderImportData() {
        return `
            <div class="page-header">
                <h1 class="page-title">Veri İçe Aktar</h1>
            </div>

            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <div class="card-header">
                    <span class="card-title">JSON Dosyası Yükle</span>
                </div>
                <div style="padding: 30px; text-align: center;">
                    <p style="margin-bottom: 20px; color: var(--gray-500);">
                        Daha önce dışa aktardığınız JSON dosyasını yükleyerek verileri geri yükleyebilirsiniz.
                    </p>
                    <div class="file-upload-area" onclick="document.getElementById('importJsonInput').click()">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 48px;"></i>
                        <p>JSON dosyası seçin veya sürükleyin</p>
                        <input type="file" id="importJsonInput" style="display: none;" accept=".json" onchange="App.handleJsonImport(this)">
                    </div>
                </div>
            </div>

            <div class="card" style="max-width: 600px; margin: 20px auto;">
                <div class="card-header">
                    <span class="card-title">Excel'den Öğrenci Aktar (Yakında)</span>
                </div>
                <div style="padding: 30px; text-align: center; opacity: 0.5;">
                    <i class="fas fa-file-excel" style="font-size: 48px; color: #10b981;"></i>
                    <p style="margin-top: 15px;">Excel dosyası ile toplu öğrenci ekleme özelliği yakında eklenecek.</p>
                </div>
            </div>
        `;
    },

    handleJsonImport(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (confirm('Mevcut veriler silinecek! Devam etmek istiyor musunuz?')) {
                    this.data = { ...this.data, ...imported };
                    this.saveData();
                    this.showToast('Veriler içe aktarıldı!');
                    window.location.reload();
                }
            } catch (err) {
                this.showToast('Geçersiz dosya formatı!', 'error');
            }
        };
        reader.readAsText(file);
    },

    renderBackups() {
        const lastBackup = this.data.lastBackup;
        return `
            <div class="page-header">
                <h1 class="page-title">Yedekleme</h1>
            </div>

            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <div class="card-header">
                    <span class="card-title">Otomatik Yedekleme</span>
                </div>
                <div style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div>
                            <h4>Son Yedekleme</h4>
                            <p style="color: var(--gray-500); font-size: 13px;">${lastBackup ? new Date(lastBackup).toLocaleString('tr-TR') : 'Henüz yedekleme yapılmadı'}</p>
                        </div>
                        <button class="btn btn-primary" onclick="App.createBackup()">
                            <i class="fas fa-download"></i> Şimdi Yedekle
                        </button>
                    </div>

                    <div style="background: var(--gray-100); padding: 15px; border-radius: 8px;">
                        <p style="font-size: 13px; color: var(--gray-500);">
                            <i class="fas fa-info-circle"></i> Yedekleme, tüm verilerinizi JSON formatında indirir. 
                            Verilerinizi düzenli olarak yedeklemeniz önerilir.
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    createBackup() {
        this.data.lastBackup = new Date().toISOString();
        this.saveData();
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `yedek-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        this.showToast('Yedekleme tamamlandı!');
    },

    renderThemes() {
        const currentTheme = this.data.settings?.theme || 'default';
        return `
            <div class="page-header">
                <h1 class="page-title">Tema Ayarları</h1>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                <div class="card" onclick="App.setTheme('default')" style="cursor: pointer; ${currentTheme === 'default' ? 'border: 3px solid var(--primary);' : ''}">
                    <div style="height: 100px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 8px; margin-bottom: 15px;"></div>
                    <h4>Varsayılan</h4>
                    <p style="font-size: 12px; color: var(--gray-500);">Mavi-Mor tema</p>
                    ${currentTheme === 'default' ? '<span class="badge badge-success" style="margin-top: 10px;">Aktif</span>' : ''}
                </div>

                <div class="card" onclick="App.setTheme('dark')" style="cursor: pointer; ${currentTheme === 'dark' ? 'border: 3px solid var(--primary);' : ''}">
                    <div style="height: 100px; background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 8px; margin-bottom: 15px;"></div>
                    <h4>Karanlık Mod</h4>
                    <p style="font-size: 12px; color: var(--gray-500);">Koyu tema</p>
                    ${currentTheme === 'dark' ? '<span class="badge badge-success" style="margin-top: 10px;">Aktif</span>' : ''}
                </div>

                <div class="card" onclick="App.setTheme('newyear')" style="cursor: pointer; ${currentTheme === 'newyear' ? 'border: 3px solid var(--primary);' : ''}">
                    <div style="height: 100px; background: linear-gradient(135deg, #dc2626, #991b1b); border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px;">🎄</span>
                    </div>
                    <h4>Yılbaşı</h4>
                    <p style="font-size: 12px; color: var(--gray-500);">Kırmızı-Yeşil tema</p>
                    ${currentTheme === 'newyear' ? '<span class="badge badge-success" style="margin-top: 10px;">Aktif</span>' : ''}
                </div>

                <div class="card" onclick="App.setTheme('april23')" style="cursor: pointer; ${currentTheme === 'april23' ? 'border: 3px solid var(--primary);' : ''}">
                    <div style="height: 100px; background: linear-gradient(135deg, #ef4444, #b91c1c); border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 40px;">🇹🇷</span>
                    </div>
                    <h4>23 Nisan</h4>
                    <p style="font-size: 12px; color: var(--gray-500);">Bayram teması</p>
                    ${currentTheme === 'april23' ? '<span class="badge badge-success" style="margin-top: 10px;">Aktif</span>' : ''}
                </div>
            </div>
        `;
    },

    setTheme(theme) {
        this.data.settings.theme = theme;
        this.saveData();
        this.applyTheme();
        this.renderPage(this.currentPage);
        this.showToast('Tema değiştirildi!');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
