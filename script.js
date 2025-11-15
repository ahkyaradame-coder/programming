// script for Learn Programming site
(function () {
	// Simple course data; in a real site this would come from an API
	const courses = [
		{ id: 1, title: 'JavaScript Essentials', level: 'beginner', desc: 'Core JS fundamentals and DOM manipulation. Build interactive web apps.' },
		{ id: 2, title: 'Python for Data', level: 'intermediate', desc: 'Learn Python and analyze data with pandas and visualization.' },
		{ id: 3, title: 'Full-Stack Web', level: 'advanced', desc: 'Build and deploy a full-stack app with Node, React, and Postgres.' },
		{ id: 4, title: 'Intro to HTML & CSS', level: 'beginner', desc: 'Foundations of the web: structure, styling, and responsive layouts.' },
		{ id: 5, title: 'APIs & Backends', level: 'intermediate', desc: 'Design RESTful APIs and work with authentication and databases.' },
		{ id: 6, title: 'DevOps Basics', level: 'advanced', desc: 'CI/CD, containers, and deployment best practices for developers.' },
		{ id: 7, title: 'React Advanced', level: 'advanced', desc: 'Master hooks, context API, state management, and performance optimization.' },
		{ id: 8, title: 'TypeScript Masterclass', level: 'intermediate', desc: 'Learn static typing, interfaces, generics, and type safety best practices.' },
		{ id: 9, title: 'Mobile Development with React Native', level: 'intermediate', desc: 'Build cross-platform iOS and Android apps with React Native.' },
		{ id: 10, title: 'Machine Learning Fundamentals', level: 'intermediate', desc: 'Introduction to ML algorithms, supervised learning, and model evaluation.' },
		{ id: 11, title: 'Database Design & SQL', level: 'intermediate', desc: 'Relational databases, normalization, complex queries, and optimization.' },
		{ id: 12, title: 'Web Security & Authentication', level: 'intermediate', desc: 'OAuth, JWT, password hashing, CSRF protection, and secure coding practices.' },
		{ id: 13, title: 'Vue.js Fundamentals', level: 'beginner', desc: 'Build interactive UIs with Vue.js, components, and state management.' },
		{ id: 14, title: 'GraphQL APIs', level: 'advanced', desc: 'Query language for APIs, resolvers, mutations, and real-time subscriptions.' },
		{ id: 15, title: 'Docker & Containers', level: 'intermediate', desc: 'Containerize applications, Docker Compose, and orchestration basics.' },
		{ id: 16, title: 'Cloud Computing with AWS', level: 'advanced', desc: 'EC2, S3, Lambda, RDS, and building scalable cloud applications.' },
		{ id: 17, title: 'Web Performance Optimization', level: 'advanced', desc: 'Caching, lazy loading, code splitting, and measuring performance metrics.' },
		{ id: 18, title: 'Git & Version Control', level: 'beginner', desc: 'Git basics, branching, merging, and collaborative workflow essentials.' }
	];

	function byId(id) { return document.getElementById(id) }
	const courseGrid = byId('courseGrid');
	const search = byId('search');
	const levelFilter = byId('levelFilter');
	const heroCTA = byId('heroCTA');
	const startBtn = byId('startBtn');

	// Simple client-side translations (English + Arabic)
	const TRANSLATIONS = {
		en: {
			lang: 'en', dir: 'ltr',
			nav: ['Courses', 'Features', 'FAQ', 'Contact'],
			heroTitle: 'Learn programming by building real projects',
			heroLead: 'Guided courses, practical exercises, and mentor-style feedback to help you go from idea to deployable projects.',
			heroCTA: 'Browse Courses',
			startBtn: 'Start Learning',
			subscribeBtn: 'Subscribe — $100/yr',
			darken: 'Darken', brighten: 'Brighten', aiToggle: 'AI Tutor',
			openFeedback: 'Give feedback', feedbackSubmit: 'Submit feedback',
			contactSend: 'Send message',
			searchPlaceholder: 'Search courses (e.g. JavaScript, Python)',
			levelAllText: 'All levels'
		},
		ar: {
			lang: 'ar', dir: 'rtl',
			nav: ['الدورات', 'المميزات', 'الأسئلة الشائعة', 'اتصل'],
			heroTitle: 'تعلم البرمجة ببناء مشاريع حقيقية',
			heroLead: 'دورات مُرشدة، تمارين عملية، وتعليقات من المرشدين لمساعدتك من الفكرة إلى مشروع قابل للنشر.',
			heroCTA: 'استعرض الدورات',
			startBtn: 'ابدأ التعلم',
			subscribeBtn: 'اشترك — 100$/سنة',
			darken: 'تعتيم', brighten: 'تفتيح', aiToggle: 'المعلم الذكي',
			openFeedback: 'قدّم ملاحظات', feedbackSubmit: 'إرسال',
			contactSend: 'إرسال الرسالة',
			searchPlaceholder: 'ابحث عن الدورات (مثل JavaScript, Python)',
			levelAllText: 'كل المستويات'
		}
	};

	function applyTranslations(lang) {
		const map = TRANSLATIONS[lang] || TRANSLATIONS.en;
		try {
			document.documentElement.lang = map.lang;
			document.documentElement.dir = map.dir;
		} catch (e) { /* ignore */ }

		// Nav links (assumes same order)
		const navLinks = document.querySelectorAll('#navMenu a');
		if (navLinks && navLinks.length) {
			navLinks.forEach((a, i) => { if (map.nav[i]) a.textContent = map.nav[i]; });
		}

		const h1 = document.querySelector('.hero-copy h1');
		const lede = document.querySelector('.hero-copy .lede');
		if (h1) h1.textContent = map.heroTitle;
		if (lede) lede.textContent = map.heroLead;

		// Buttons and labels
		const heroCta = byId('heroCTA'); if (heroCta) heroCta.textContent = map.heroCTA;
		const sBtn = byId('startBtn'); if (sBtn) sBtn.textContent = map.startBtn;
		const subBtn = byId('subscribeBtn'); if (subBtn) subBtn.textContent = map.subscribeBtn;
		const dark = byId('darkenBtn'); if (dark) dark.textContent = map.darken;
		const light = byId('brightenBtn'); if (light) light.textContent = map.brighten;
		const ai = byId('aiToggle'); if (ai) ai.textContent = map.aiToggle;
		const ofb = byId('openFeedback'); if (ofb) ofb.textContent = map.openFeedback;
		const fbSubmit = byId('feedbackSubmit'); if (fbSubmit) fbSubmit.textContent = map.feedbackSubmit;

		// Contact form button
		const contactSend = document.querySelector('#contactForm .form-actions .btn.btn-primary');
		if (contactSend) contactSend.textContent = map.contactSend;

		// Search placeholder and level filter first option
		const s = byId('search'); if (s) s.placeholder = map.searchPlaceholder;
		const level = byId('levelFilter'); if (level && level.options && level.options.length) level.options[0].text = map.levelAllText;
	}

	function setLanguage(lang) {
		localStorage.setItem('siteLang', lang);
		applyTranslations(lang);
		// update active state on buttons
		const en = byId('langEnBtn'), ar = byId('langArBtn');
		if (en) en.classList.toggle('active', lang === 'en');
		if (ar) ar.classList.toggle('active', lang === 'ar');
	}

	function initLanguage() {
		const en = byId('langEnBtn'), ar = byId('langArBtn');
		if (en) en.addEventListener('click', () => setLanguage('en'));
		if (ar) ar.addEventListener('click', () => setLanguage('ar'));
		const saved = localStorage.getItem('siteLang') || (navigator.language && navigator.language.startsWith('ar') ? 'ar' : 'en');
		setLanguage(saved);
	}

	function createCard(c) {
		const div = document.createElement('article');
		div.className = 'card';
		div.innerHTML = `
			<h3>${c.title}</h3>
			<p>${c.desc}</p>
			<div class="meta">
				<span class="label">${c.level}</span>
				<span style="flex:1"></span>
				<button class="btn btn-ghost enroll" data-id="${c.id}">View</button>
			</div>
		`;
		return div;
	}

	function render(list) {
		courseGrid.innerHTML = '';
		if (!list.length) {
			courseGrid.innerHTML = '<div class="muted">No courses found.</div>';
			return;
		}
		list.forEach(c => courseGrid.appendChild(createCard(c)));
	}

	function filterCourses() {
		const q = (search.value || '').trim().toLowerCase();
		const level = levelFilter.value;
		const out = courses.filter(c => {
			const inLevel = level === 'all' ? true : c.level === level;
			const inQuery = q === '' ? true : (c.title + ' ' + c.desc).toLowerCase().indexOf(q) !== -1;
			return inLevel && inQuery;
		});
		render(out);
	}

	// FAQ accordion
	function initFAQ() {
		const faqItems = document.querySelectorAll('.faq-item');
		faqItems.forEach(btn => {
			btn.addEventListener('click', () => {
				btn.classList.toggle('open');
			});
		});
	}

	// smooth scrolling for hero CTAs
	function smoothTo(selector) {
		const el = document.querySelector(selector);
		if (!el) return;
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// wire events
	document.addEventListener('DOMContentLoaded', () => {
		render(courses);
		initFAQ();
		byId('year').textContent = new Date().getFullYear();

		// Mobile menu toggle
		const menuToggle = byId('menuToggle');
		const navMenu = byId('navMenu');
		if (menuToggle && navMenu) {
			menuToggle.addEventListener('click', () => {
				const isOpen = navMenu.classList.toggle('active');
				menuToggle.setAttribute('aria-expanded', isOpen);
			});
			// Close menu when a nav link is clicked
			navMenu.querySelectorAll('a').forEach(link => {
				link.addEventListener('click', () => {
					navMenu.classList.remove('active');
					menuToggle.setAttribute('aria-expanded', 'false');
				});
			});
		}

		search.addEventListener('input', debounce(filterCourses, 180));
		levelFilter.addEventListener('change', filterCourses);

		heroCTA.addEventListener('click', () => smoothTo('#courses'));
		startBtn && startBtn.addEventListener('click', () => smoothTo('#courses'));

		// contact form simple handler
		const contactForm = byId('contactForm');
		contactForm.addEventListener('submit', (ev) => {
			ev.preventDefault();
			const name = byId('name').value || 'Friend';
			alert(`Thanks, ${name}! We'll get back to you soon.`);
			contactForm.reset();
		});

		// delegate view/enroll buttons
		courseGrid.addEventListener('click', (ev) => {
			const btn = ev.target.closest('.enroll');
			if (!btn) return;
			const id = btn.dataset.id;
			const course = courses.find(c => String(c.id) === String(id));
			if (course) alert(`${course.title}\n\n${course.desc}`);
		});
		// Generate JSON-LD structured data dynamically from the courses array
		try {
			injectStructuredData(courses);
		} catch (e) {
			// if structured data fails we don't want to break the page
			console.warn('Structured data injection failed', e);
		}

		// Initialize dimmer controls
		initDimmer();

		// Subscribe button on pricing
		const subscribeBtn = document.getElementById('subscribeBtn');
		if (subscribeBtn) {
			subscribeBtn.addEventListener('click', () => {
				const user = window.Auth.getCurrentUser();
				if (!user) {
					// redirect to login if not signed in
					window.location.href = 'login.html';
					return;
				}
				// start PayPal flow
				startPayPalCheckout(100, user.email || '');
			});
		}

		// auto-start subscribe flow if URL contains ?subscribe=1
		try {
			const params = new URLSearchParams(window.location.search);
			if (params.get('subscribe') === '1') {
				const user = window.Auth.getCurrentUser();
				if (user) startPayPalCheckout(100, user.email || '');
				else window.location.href = 'login.html?subscribe=1';
			}
		} catch (e) {/* ignore */ }

		// Feedback widget wiring
		const openFeedback = byId('openFeedback');
		const feedbackFormWrap = byId('feedbackFormWrap');
		const feedbackForm = byId('feedbackForm');
		const feedbackStars = byId('feedbackStars');
		const feedbackComment = byId('feedbackComment');
		const feedbackSubmit = byId('feedbackSubmit');
		const feedbackAvg = byId('feedbackAvg');
		const feedbackCount = byId('feedbackCount');
		const feedbackList = byId('feedbackList');
		let selectedRating = 0;

		function loadFeedback() {
			const data = JSON.parse(localStorage.getItem('siteFeedback') || '[]');
			renderFeedback(data);
			updateSummary(data);
		}

		// show an inline thank-you message near the feedback area
		function showInlineThanks(name) {
			const wrap = document.getElementById('feedbackFormWrap');
			if (!wrap) return;
			// remove existing message if present
			const existing = document.getElementById('feedbackThanks');
			if (existing) existing.remove();
			const msg = document.createElement('div');
			msg.id = 'feedbackThanks';
			msg.setAttribute('role', 'status');
			msg.style.marginTop = '10px';
			msg.style.padding = '10px 12px';
			msg.style.borderRadius = '8px';
			msg.style.background = 'linear-gradient(90deg,var(--accent),var(--accent-2))';
			msg.style.color = 'white';
			msg.style.fontWeight = '600';
			msg.style.boxShadow = '0 6px 18px rgba(2,6,23,0.6)';
			msg.textContent = `Thanks ${name || '—'}! Your rating was recorded.`;
			wrap.parentNode.insertBefore(msg, wrap.nextSibling);
			// fade out and remove after 4 seconds
			setTimeout(() => {
				msg.style.transition = 'opacity 600ms ease, transform 600ms ease';
				msg.style.opacity = '0';
				msg.style.transform = 'translateY(-6px)';
				setTimeout(() => msg.remove(), 700);
			}, 4000);
		}

		function _escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c]; }); }

		function saveFeedbackItem(item) {
			const arr = JSON.parse(localStorage.getItem('siteFeedback') || '[]');
			arr.unshift(item);
			localStorage.setItem('siteFeedback', JSON.stringify(arr));
			renderFeedback(arr);
			updateSummary(arr);
		}

		function updateSummary(arr) {
			if (!arr || !arr.length) { feedbackAvg.textContent = 'No ratings yet'; feedbackCount.textContent = 'Be the first to rate'; return; }
			const count = arr.length;
			const avg = (arr.reduce((s, it) => s + Number(it.rating || 0), 0) / count).toFixed(2);
			feedbackAvg.textContent = `${avg} ★ average`;
			feedbackCount.textContent = `${count} rating${count > 1 ? 's' : ''}`;
		}

		function renderFeedback(arr) {
			if (!feedbackList) return;
			feedbackList.innerHTML = '';
			if (!arr || !arr.length) return;
			arr.forEach(it => {
				const node = document.createElement('div'); node.className = 'feedback-item';
				node.innerHTML = `<div class="meta"><strong>${_escapeHtml(it.name || 'Anonymous')}</strong> • ${it.rating} ★ • <span class="muted">${new Date(it.t).toLocaleString()}</span></div><div>${_escapeHtml(it.comment || '')}</div>`;
				feedbackList.appendChild(node);
			});
		}

		if (openFeedback) openFeedback.addEventListener('click', () => { if (!feedbackFormWrap) return; feedbackFormWrap.style.display = (feedbackFormWrap.style.display === 'none' || feedbackFormWrap.style.display === '') ? 'block' : 'none'; });

		if (feedbackStars) {
			feedbackStars.querySelectorAll('.star').forEach(btn => {
				btn.addEventListener('click', () => {
					selectedRating = Number(btn.dataset.value || 0);
					feedbackStars.querySelectorAll('.star').forEach(s => s.classList.toggle('active', Number(s.dataset.value) <= selectedRating));
				});
			});
		}

		if (feedbackForm) {
			feedbackForm.addEventListener('submit', (ev) => {
				ev.preventDefault();
				const comment = (feedbackComment && feedbackComment.value || '').trim();
				const name = (byId('name') && byId('name').value) || 'Guest';
				if (!selectedRating) { alert('Please select a rating 1-5'); return; }
				const item = { rating: selectedRating, comment: comment, name: name, t: new Date().toISOString() };
				saveFeedbackItem(item);
				if (feedbackComment) feedbackComment.value = ''; selectedRating = 0;
				if (feedbackStars) feedbackStars.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
				if (feedbackFormWrap) feedbackFormWrap.style.display = 'none';
				showInlineThanks(name);
			});
		}

		loadFeedback();

		// Initialize language (EN / AR)
		initLanguage();

	});

	function debounce(fn, wait) {
		let t;
		return function () {
			clearTimeout(t);
			t = setTimeout(() => fn.apply(this, arguments), wait);
		};

		// Simulated subscription purchase API: attaches subscription data to authUser
		window.Auth.purchaseSubscription = function (amount, period) {
			return new Promise((resolve) => {
				const user = window.Auth.getCurrentUser();
				if (!user) { resolve(null); return; }
				const now = new Date();
				const expires = new Date(now.getTime());
				if (period === 'year' || period === 'annual') {
					expires.setFullYear(expires.getFullYear() + 1);
				} else if (typeof period === 'number') {
					expires.setDate(expires.getDate() + Number(period));
				}
				user.subscription = { plan: 'annual', price: Number(amount), expires: expires.toISOString() };
				localStorage.setItem('authUser', JSON.stringify(user));
				resolve(user.subscription);
			});
		};
	}

	/* Structured Data: create JSON-LD for Organization, WebSite and Course items.
		 This improves search engines' understanding of the site and courses. */
	function injectStructuredData(courseList) {
		// Use the current site origin when available so structured data matches deployment
		const domain = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://example.com'; // <-- Replace fallback with your production domain if needed
		const coursesLd = courseList.map(c => ({
			'@type': 'Course',
			'name': c.title,
			'description': c.desc,
			'provider': {
				'@type': 'Organization',
				'name': 'CodeLearn',
				'sameAs': domain
			},
			'url': `${domain}/code.html#course-${c.id}`
		}));

		const ld = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebSite',
					'name': 'CodeLearn',
					'url': domain,
					'potentialAction': {
						'@type': 'SearchAction',
						'target': `${domain}/?q={search_term_string}`,
						'query-input': 'required name=search_term_string'
					}
				},
				{
					'@type': 'Organization',
					'name': 'CodeLearn',
					'url': domain
				},
				...coursesLd
			]
		};

		const script = document.createElement('script');
		script.type = 'application/ld+json';
		script.text = JSON.stringify(ld, null, 2);
		document.head.appendChild(script);
	}

	/* Dimmer / Brighten Controls */
	function initDimmer() {
		const step = 0.15; // opacity step per press
		const min = 0; const max = 0.95;
		let dimmer = document.getElementById('dimmer');
		if (!dimmer) {
			dimmer = document.createElement('div');
			dimmer.id = 'dimmer';
			dimmer.setAttribute('aria-hidden', 'true');
			document.body.appendChild(dimmer);
		}

		// read stored opacity
		let current = parseFloat(localStorage.getItem('site-dimmer-opacity') || '0');
		current = clamp(current, min, max);
		applyOpacity(current);

		const darkBtn = document.getElementById('darkenBtn');
		const lightBtn = document.getElementById('brightenBtn');

		darkBtn && darkBtn.addEventListener('click', () => {
			current = clamp(current + step, min, max);
			applyOpacity(current);
		});

		lightBtn && lightBtn.addEventListener('click', () => {
			current = clamp(current - step, min, max);
			applyOpacity(current);
		});


		/* --- Authentication helpers (client-side demo) --- */
		// Expose a small Auth API for the demo pages (login.html)
		window.Auth = {
			getCurrentUser: function () {
				try { return JSON.parse(localStorage.getItem('authUser') || 'null'); } catch (e) { return null }
			},
			signInWithEmail: function (email, name) {
				return new Promise((resolve) => {
					const user = { name: name || email.split('@')[0], email, provider: 'email' };
					localStorage.setItem('authUser', JSON.stringify(user));
					updateUserArea();
					resolve(user);
				});
			},
			signInWithGoogle: function () {
				return new Promise((resolve) => {
					// Demo: simulated Google sign-in. In real integration, open OAuth flow.
					const user = { name: 'Google User', email: 'user@gmail.com', provider: 'google' };
					localStorage.setItem('authUser', JSON.stringify(user));
					updateUserArea();
					resolve(user);
				});
			},
			signOut: function () {
				localStorage.removeItem('authUser');
				updateUserArea();
			}
		};

		function updateUserArea() {
			const ua = document.getElementById('userArea');
			if (!ua) return;
			const user = window.Auth.getCurrentUser();
			if (user) {
				const sub = user.subscription && user.subscription.expires ? ('<span class="sub-badge">' + (user.subscription.plan || 'Member') + ' • ' + (new Date(user.subscription.expires).toLocaleDateString()) + '</span>') : '';
				// Avatar: use stored data url if available, otherwise fallback to initial
				const avatarHtml = user.avatar ? (`<img src="${user.avatar}" alt="${escapeHtml(user.name || 'Avatar')}" class="avatar-img" />`) : (`<span class="avatar-fallback" style="background:linear-gradient(90deg,#5a3bff,#00c2a8);width:36px;height:36px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;color:white;font-weight:700">${(user.name || 'U').charAt(0).toUpperCase()}</span>`);
				ua.innerHTML = `
					<span style="display:inline-flex;align-items:center;gap:8px">
					  ${avatarHtml}
					  <strong style="color:var(--muted)">${escapeHtml(user.name || 'Member')}</strong>
					</span>
					${sub}
					<input id="avatarInput" type="file" accept="image/*" style="display:none" />
					<button id="changeAvatarBtn" class="btn btn-ghost" style="margin-left:10px">Change Avatar</button>
					${user.avatar ? '<button id="removeAvatarBtn" class="btn btn-ghost" style="margin-left:6px">Remove Avatar</button>' : ''}
					<button id="logoutBtn" class="btn btn-ghost" style="margin-left:6px">Logout</button>
				`;
				const avatarInput = document.getElementById('avatarInput');
				const changeAvatarBtn = document.getElementById('changeAvatarBtn');
				const removeAvatarBtn = document.getElementById('removeAvatarBtn');
				const logoutBtn = document.getElementById('logoutBtn');

				changeAvatarBtn && changeAvatarBtn.addEventListener('click', () => { avatarInput && avatarInput.click(); });
				avatarInput && avatarInput.addEventListener('change', (ev) => {
					const f = ev.target.files && ev.target.files[0];
					if (!f) return;
					if (!f.type.startsWith('image/')) { alert('Please select an image file.'); return; }
					const r = new FileReader();
					r.onload = function () {
						user.avatar = r.result;
						localStorage.setItem('authUser', JSON.stringify(user));
						updateUserArea();
					};
					r.readAsDataURL(f);
				});

				removeAvatarBtn && removeAvatarBtn.addEventListener('click', () => {
					if (!confirm('Remove your profile image?')) return;
					delete user.avatar;
					localStorage.setItem('authUser', JSON.stringify(user));
					updateUserArea();
				});

				logoutBtn && logoutBtn.addEventListener('click', () => { window.Auth.signOut(); });
			} else {
				ua.innerHTML = `<a id="loginLink" class="btn btn-ghost" href="login.html">Login</a>`;
			}
		}

		function escapeHtml(s) {
			return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
		}

		// ensure header reflects auth state as soon as possible
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			setTimeout(updateUserArea, 0);
		} else {
			document.addEventListener('DOMContentLoaded', updateUserArea);
		}

		// PayPal Checkout integration (client + server)
		let _paypalLoaded = false;
		function loadPayPalSdk(clientId) {
			return new Promise((resolve, reject) => {
				if (_paypalLoaded) return resolve(window.paypal);
				const s = document.createElement('script');
				s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD`;
				s.onload = () => { _paypalLoaded = true; resolve(window.paypal); };
				s.onerror = reject;
				document.head.appendChild(s);
			});
		}

		async function startPayPalCheckout(amount, buyerEmail) {
			try {
				const cfg = await fetch('/api/config').then(r => r.json());
				if (!cfg.clientId) throw new Error('PayPal client id not configured on server');
				const paypal = await loadPayPalSdk(cfg.clientId);
				const container = document.getElementById('paypalContainer');
				container.style.display = 'block'; container.innerHTML = '';
				paypal.Buttons({
					createOrder: async function () {
						const resp = await fetch('/api/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: amount, email: buyerEmail }) });
						const data = await resp.json();
						if (data && data.id) return data.id;
						throw new Error('Failed to create order');
					},
					onApprove: async function (data) {
						// capture on server
						try {
							const resp = await fetch('/api/capture-order', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ orderID: data.orderID })
							});
							const result = await resp.json();
							// for demo: if capture succeeded, grant subscription locally
							if (result && (result.status === 'COMPLETED' || (result.purchase_units && result.purchase_units[0] && result.purchase_units[0].payments))) {
								// store subscription locally for demo purposes
								if (window.Auth && typeof window.Auth.purchaseSubscription === 'function') {
									await window.Auth.purchaseSubscription(amount, 'year');
									updateUserArea();
									alert('Payment captured. Your subscription is active.');
								} else {
									alert('Payment captured. (Demo)');
								}
							} else {
								console.warn('Capture response', result);
								alert('Payment captured (response received).');
							}
						} catch (err) {
							console.error('Capture failed', err);
							alert('Payment capture failed: ' + (err.message || err));
						}
					}
				}).render('#paypalContainer');
			} catch (err) {
				console.error('PayPal error', err); alert('PayPal checkout failed: ' + err.message);
			}
		}
		// keyboard shortcuts: D = darken, L = lighten, 0 = reset
		document.addEventListener('keydown', (ev) => {
			if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
			if (ev.key === 'd' || ev.key === 'D') {
				ev.preventDefault(); current = clamp(current + step, min, max); applyOpacity(current);
			}
			if (ev.key === 'l' || ev.key === 'L') {
				ev.preventDefault(); current = clamp(current - step, min, max); applyOpacity(current);
			}
			if (ev.key === '0') {
				ev.preventDefault(); current = 0; applyOpacity(current);
			}
		});

		function applyOpacity(val) {
			const o = clamp(val, min, max);
			dimmer.style.background = `rgba(0,0,0,${o})`;
			dimmer.style.opacity = o > 0 ? '1' : '0';
			localStorage.setItem('site-dimmer-opacity', String(o));
			// update aria-live for assistive tech (not announcing numeric detail to avoid noise)
			if (o === 0) {
				dimmer.removeAttribute('aria-label');
			} else {
				dimmer.setAttribute('aria-label', `Screen dimmed`);
			}
		}

		function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
	}

	/* --- AI Tutor frontend (client) --- */
	function createAiMessage(text, who) {
		who = typeof who === 'undefined' ? 'ai' : who;
		const container = document.getElementById('aiMessages');
		if (!container) return;
		const el = document.createElement('div');
		el.className = 'msg ' + (who === 'user' ? 'user' : 'ai');
		const bubble = document.createElement('div');
		bubble.className = 'bubble ' + (who === 'user' ? 'user' : 'ai');
		bubble.textContent = text;
		el.appendChild(bubble);
		container.appendChild(el);
		container.scrollTop = container.scrollHeight;
	}

	function aiAsk(question) {
		if (!question) return;
		createAiMessage(question, 'user');
		// Try server-side AI proxy first
		fetch('/api/ai', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: [{ role: 'user', content: question }] })
		})
			.then(r => r.ok ? r.json() : Promise.reject(r))
			.then(data => {
				const reply = (data && (data.reply || (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content))) || 'Sorry, I could not produce an answer.';
				createAiMessage(reply, 'ai');
			})
			.catch(err => {
				console.warn('AI proxy error', err);
				const canned = cannedAiResponse(question);
				createAiMessage(canned, 'ai');
			});
	}

	function cannedAiResponse(q) {
		const s = String(q).toLowerCase();

		// Exercise & Practice Requests
		if (s.includes('exercise') || s.includes('practice') || s.includes('project')) {
			const exercises = [
				'Build a todo app: Create functions to add, remove, and filter tasks. Store state in an array, and persist to localStorage.',
				'Create a password validator: Write a function checking length (8+), uppercase, lowercase, numbers, and special chars. Return detailed feedback for each rule.',
				'Build a simple calculator: Implement +, −, ×, ÷ with proper error handling for division by zero. Add keyboard shortcuts.',
				'Clone a GitHub user search: Fetch user data from GitHub API, display repos, followers, and profile info in a clean card layout.',
				'Create a quiz app: Build multiple-choice questions with score tracking, instant feedback, and category filtering.'
			];
			return exercises[Math.floor(Math.random() * exercises.length)];
		}

		// Concept Explanations
		if (s.includes('explain')) {
			if (s.includes('array') || s.includes('list')) {
				return 'Arrays store multiple values in a single variable. Create with [1,2,3], access by index (0-based): arr[0] = 1. Key methods: push() (add), pop() (remove), map() (transform), filter() (select), reduce() (aggregate). Tip: Always check length before accessing by index.';
			}
			if (s.includes('function') || s.includes('method')) {
				return 'Functions are reusable blocks of code. Define with function myFunc(param) { } or arrow: const myFunc = (param) => { }. Return values with return statement. Pass args to parameters. Higher-order functions accept/return functions for powerful abstractions.';
			}
			if (s.includes('promise') || s.includes('async')) {
				return 'Promises handle async operations (API calls, timers). Three states: pending → resolved → rejected. Chain with .then(success, error) or async/await: const data = await fetch(url); Avoid promise hell by using async/await for cleaner code.';
			}
			if (s.includes('loop') || s.includes('iteration')) {
				return 'Loops repeat code. for (let i=0; i<n; i++) for indexing. for...of for values, for...in for keys (objects). while/do...while for conditional loops. Modern: forEach, map, filter, reduce on arrays avoid manual loops and index bugs.';
			}
			if (s.includes('class') || s.includes('oop') || s.includes('object')) {
				return 'Objects group related data & methods. Create: const person = { name: "Jane", age: 30, greet() { } }. Classes template multiple objects: class Person { constructor(name) { } }. Inheritance with extends, encapsulation with private fields (#field).';
			}
			if (s.includes('variable') || s.includes('scope')) {
				return 'Variables store data. const (immutable), let (block-scoped), var (function-scoped, avoid). Scope: global > function > block. Closures let inner functions access outer scope. Use const by default, let if reassignment needed.';
			}
		}

		// Debugging & Problem Solving
		if (s.includes('debug') || s.includes('error') || s.includes('fix') || s.includes('wrong')) {
			return 'Debugging tips: (1) Read the error message carefully—it points to the issue. (2) Use console.log() to trace variable values. (3) Use debugger; or browser DevTools to step through code. (4) Check assumptions—off-by-one errors, null checks, type mismatches. (5) Reproduce minimally—isolate the problem.';
		}

		// Code Writing Requests
		if (s.includes('write') || s.includes('code')) {
			if (s.includes('function')) {
				return 'function double(n) { return n * 2; } or const double = n => n * 2; For reuse, avoid hard-coding values. Test edge cases: null, 0, negative numbers, large values.';
			}
			if (s.includes('loop') && s.includes('array')) {
				return 'const result = arr.map(x => x * 2); or arr.forEach(x => console.log(x)); Modern JS prefers map/filter/reduce over for loops—cleaner and fewer bugs.';
			}
		}

		// Best Practices
		if (s.includes('best practice') || s.includes('convention') || s.includes('clean code')) {
			return 'Clean code practices: (1) Use meaningful names (searchResults, not sr). (2) Keep functions small & focused (single responsibility). (3) Comment the "why", not the "what". (4) DRY: don\'t repeat code—extract to functions. (5) Test edge cases. (6) Format consistently (use Prettier).';
		}

		// Performance & Optimization
		if (s.includes('perform') || s.includes('optim') || s.includes('fast')) {
			return 'Performance tips: (1) Avoid loops in loops (O(n²)). (2) Cache DOM queries (getElementById is slow). (3) Use const/let, not var. (4) Lazy-load images. (5) Debounce event handlers (search, resize). (6) Use Set instead of array.includes() for large data.';
		}

		// Learning Path
		if (s.includes('learn') || s.includes('path') || s.includes('beginner')) {
			return 'Learning path: 1. Variables, loops, functions (fundamentals). 2. DOM manipulation & events (interactivity). 3. APIs & async (real-world). 4. Frameworks (React, Vue). 5. Databases & backends. Build small projects after each step—the best way to learn.';
		}

		// Testing
		if (s.includes('test')) {
			return 'Testing: Unit test with Jest/Mocha—test individual functions. Example: expect(add(2,3)).toBe(5); Write tests before code (TDD). Test happy path + edge cases (null, empty, negative). CI/CD runs tests automatically on each commit.';
		}

		// Friendly Greetings
		if (s.includes('hello') || s.includes('hi') || s.includes('hey') || s.includes('thanks')) {
			return 'Hey! 👋 I\'m your AI tutor. Ask me to explain concepts, generate exercises, help debug code, or share best practices. What would you like to learn about programming today?';
		}

		// Default helpful fallback
		return 'I\'m your AI tutor powered by advanced language models. I can:\n• Explain programming concepts (functions, arrays, async, OOP)\n• Generate hands-on exercises & projects\n• Help debug errors & solve problems\n• Share clean code best practices\n• Suggest learning paths\n\nTry asking me anything—or explore the courses above. What would you like help with?';
	}

	// Wire chat UI
	(function wireAiUi() {
		const aiToggle = document.getElementById('aiToggle');
		const aiTutor = document.getElementById('aiTutor');
		const aiClose = document.getElementById('aiClose');
		const aiForm = document.getElementById('aiForm');
		const aiInput = document.getElementById('aiInput');

		if (aiToggle && aiTutor) {
			aiToggle.addEventListener('click', () => { aiTutor.setAttribute('aria-hidden', 'false'); aiTutor.style.display = 'flex'; aiInput && aiInput.focus(); });
		}
		if (aiClose) { aiClose.addEventListener('click', () => { aiTutor.setAttribute('aria-hidden', 'true'); aiTutor.style.display = 'none'; }); }
		if (aiForm) { aiForm.addEventListener('submit', (ev) => { ev.preventDefault(); const q = aiInput.value.trim(); if (!q) return; aiInput.value = ''; aiAsk(q); }); }
		// keyboard to open tutor (T)
		document.addEventListener('keydown', (ev) => { if (ev.key === 't' || ev.key === 'T') { if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return; ev.preventDefault(); aiToggle && aiToggle.click(); } });
	})();

	/* --- Discount Wheel --- */
	(function wireWheelUi() {
		const wheelModal = byId('wheelModal');
		const wheelBtn = byId('wheelBtn');
		const wheelClose = byId('wheelClose');
		const spinBtn = byId('spinBtn');
		const discountWheel = document.getElementById('discountWheel');
		const wheelResult = byId('wheelResult');
		const resultText = byId('resultText');
		const resultDesc = byId('resultDesc');
		const applyDiscountBtn = byId('applyDiscountBtn');

		const discounts = [
			{ percent: 10, label: '10%', color: '#FF6B6B' },
			{ percent: 15, label: '15%', color: '#4ECDC4' },
			{ percent: 20, label: '20%', color: '#45B7D1' },
			{ percent: 25, label: '25%', color: '#96CEB4' },
			{ percent: 30, label: '30%', color: '#FFEAA7' },
			{ percent: 40, label: '40%', color: '#DDA15E' },
			{ percent: 50, label: '50%', color: '#BC6C25' },
			{ percent: 'Free', label: 'FREE!', color: '#6C5CE7' }
		];

		let currentDiscount = null;
		let isSpinning = false;
		let hasSpun = localStorage.getItem('wheelHasSpun') === 'true';
		let lastSpinTime = localStorage.getItem('wheelLastSpinTime') ? parseInt(localStorage.getItem('wheelLastSpinTime')) : null;
		const SPIN_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour in milliseconds

		function checkSpinCooldown() {
			if (!lastSpinTime) return { canSpin: true, timeUntilReset: 0 };
			const now = Date.now();
			const timeSinceLastSpin = now - lastSpinTime;
			const canSpin = timeSinceLastSpin >= SPIN_COOLDOWN_MS;
			const timeUntilReset = Math.max(0, SPIN_COOLDOWN_MS - timeSinceLastSpin);
			return { canSpin, timeUntilReset };
		}

		function formatTimeRemaining(ms) {
			const minutes = Math.floor(ms / 60000);
			const seconds = Math.floor((ms % 60000) / 1000);
			return `${minutes}m ${seconds}s`;
		}

		function generateWheelSvg() {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('viewBox', '0 0 200 200');
			svg.setAttribute('width', '300');
			svg.setAttribute('height', '300');
			svg.setAttribute('class', 'discount-wheel');

			const sliceAngle = 360 / discounts.length;
			const radius = 100;
			const center = 100;

			discounts.forEach((discount, i) => {
				const startAngle = i * sliceAngle;
				const endAngle = (i + 1) * sliceAngle;
				const startRad = (startAngle - 90) * (Math.PI / 180);
				const endRad = (endAngle - 90) * (Math.PI / 180);

				const x1 = center + radius * Math.cos(startRad);
				const y1 = center + radius * Math.sin(startRad);
				const x2 = center + radius * Math.cos(endRad);
				const y2 = center + radius * Math.sin(endRad);

				const largeArc = sliceAngle > 180 ? 1 : 0;
				const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				path.setAttribute('d', `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`);
				path.setAttribute('fill', discount.color);
				path.setAttribute('stroke', '#0f1724');
				path.setAttribute('stroke-width', '2');
				svg.appendChild(path);

				const textAngle = (startAngle + sliceAngle / 2) * (Math.PI / 180);
				const textRadius = radius * 0.65;
				const textX = center + textRadius * Math.cos(textAngle - Math.PI / 2);
				const textY = center + textRadius * Math.sin(textAngle - Math.PI / 2);

				const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				text.setAttribute('x', textX);
				text.setAttribute('y', textY);
				text.setAttribute('text-anchor', 'middle');
				text.setAttribute('dominant-baseline', 'middle');
				text.setAttribute('font-weight', 'bold');
				text.setAttribute('font-size', '16');
				text.setAttribute('fill', '#0f1724');
				text.setAttribute('pointer-events', 'none');
				text.textContent = discount.label;
				svg.appendChild(text);
			});

			return svg;
		}

		function drawWheel() {
			if (!discountWheel) return;
			discountWheel.innerHTML = '';
			const svg = generateWheelSvg();
			discountWheel.parentNode.replaceChild(svg, discountWheel);
		}

		function spinWheel() {
			if (isSpinning) return;

			// Check cooldown
			const cooldown = checkSpinCooldown();
			if (!cooldown.canSpin) {
				const timeRemaining = formatTimeRemaining(cooldown.timeUntilReset);
				alert(`⏱️ You can spin again in ${timeRemaining}. Please come back later!`);
				return;
			}

			isSpinning = true;
			spinBtn.disabled = true;
			wheelResult.style.display = 'none';

			const svg = document.querySelector('.discount-wheel');
			const spins = 5 + Math.random() * 5; // 5-10 full rotations
			const randomSlice = Math.floor(Math.random() * discounts.length);
			const sliceAngle = 360 / discounts.length;
			const finalAngle = spins * 360 + randomSlice * sliceAngle + sliceAngle / 2;

			svg.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.98)';
			svg.style.transform = `rotate(${finalAngle}deg)`;

			setTimeout(() => {
				isSpinning = false;
				currentDiscount = discounts[randomSlice];
				lastSpinTime = Date.now();
				localStorage.setItem('wheelLastSpinTime', String(lastSpinTime));
				spinBtn.disabled = true;
				spinBtn.textContent = 'Spin Again in 1 Hour';
				spinBtn.style.opacity = '0.5';
				spinBtn.style.cursor = 'not-allowed';
				wheelResult.style.display = 'block';
				showResult();
				startCooldownTimer();
			}, 4000);
		}

		function startCooldownTimer() {
			const timerInterval = setInterval(() => {
				const cooldown = checkSpinCooldown();
				if (cooldown.canSpin) {
					clearInterval(timerInterval);
					// Re-enable the button
					hasSpun = false;
					localStorage.removeItem('wheelLastSpinTime');
					spinBtn.disabled = false;
					spinBtn.textContent = 'SPIN!';
					spinBtn.style.opacity = '1';
					spinBtn.style.cursor = 'pointer';
				} else {
					const timeRemaining = formatTimeRemaining(cooldown.timeUntilReset);
					spinBtn.textContent = `Spin Again in ${timeRemaining}`;
				}
			}, 1000); // Update every second
		}

		function showResult() {
			resultText.textContent = `You won ${currentDiscount.label} off!`;
			resultDesc.textContent = currentDiscount.percent === 'Free' ? 'Claim your free membership now!' : `That's $${Math.round(100 * (currentDiscount.percent / 100))} in savings!`;
			wheelResult.style.display = 'block';
			createConfetti();
		}

		function createConfetti() {
			const wheelContent = byId('wheelModal');
			const stickers = ['🎉', '⭐', '🎊', '💰', '✨', '🏆', '🎁', '🚀'];

			for (let i = 0; i < 20; i++) {
				const sticker = document.createElement('div');
				sticker.className = 'sticker';
				sticker.textContent = stickers[Math.floor(Math.random() * stickers.length)];
				sticker.style.left = Math.random() * 100 + '%';
				sticker.style.top = '50%';
				sticker.style.fontSize = (20 + Math.random() * 30) + 'px';

				wheelContent.appendChild(sticker);

				// Animate each sticker
				const angle = (Math.PI * 2 * i) / 20; // Distribute around circle
				const velocity = 300 + Math.random() * 200; // pixels per second
				const duration = 2 + Math.random() * 1.5; // seconds

				const xDist = Math.cos(angle) * velocity * duration;
				const yDist = Math.sin(angle) * velocity * duration - 100; // Upward bias

				sticker.style.animation = `stickerFly ${duration}s ease-out forwards`;
				sticker.style.setProperty('--tx', `${xDist}px`);
				sticker.style.setProperty('--ty', `${yDist}px`);
				sticker.style.setProperty('--duration', `${duration}s`);

				// Remove sticker after animation
				setTimeout(() => sticker.remove(), duration * 1000);
			}
		}

		if (wheelBtn) {
			wheelBtn.addEventListener('click', () => {
				wheelModal.setAttribute('aria-hidden', 'false');
				wheelModal.style.display = 'flex';
				// Update button state based on cooldown
				const cooldown = checkSpinCooldown();
				if (!cooldown.canSpin) {
					const timeRemaining = formatTimeRemaining(cooldown.timeUntilReset);
					spinBtn.textContent = `Spin Again in ${timeRemaining}`;
					spinBtn.style.opacity = '0.5';
					spinBtn.style.cursor = 'not-allowed';
					spinBtn.disabled = true;
					startCooldownTimer();
				} else {
					spinBtn.textContent = 'SPIN!';
					spinBtn.style.opacity = '1';
					spinBtn.style.cursor = 'pointer';
					spinBtn.disabled = false;
				}
			});
		}

		if (wheelClose || wheelModal) {
			wheelClose && wheelClose.addEventListener('click', () => {
				wheelModal.setAttribute('aria-hidden', 'true');
				wheelModal.style.display = 'none';
				svg = document.querySelector('.discount-wheel');
				if (svg) svg.style.transform = 'rotate(0deg)';
				wheelResult.style.display = 'none';
			});

			wheelModal.addEventListener('click', (ev) => {
				if (ev.target === wheelModal) {
					wheelModal.setAttribute('aria-hidden', 'true');
					wheelModal.style.display = 'none';
					const svg = document.querySelector('.discount-wheel');
					if (svg) svg.style.transform = 'rotate(0deg)';
					wheelResult.style.display = 'none';
				}
			});
		}

		if (spinBtn) {
			spinBtn.addEventListener('click', spinWheel);
		}

		/* --- WhatsApp expert wiring --- */
		(function wireWhatsapp() {
			const waBtn = byId('whatsappBtn');
			const waModal = byId('whatsappModal');
			const waClose = byId('whatsappClose');
			const cancelWa = byId('cancelWhatsapp');
			const openWa = byId('openWhatsapp');
			const waNumber = byId('waNumber');
			const waMessage = byId('waMessage');

			function sanitizeNumber(raw) {
				if (!raw) return '';
				let s = String(raw).replace(/[^0-9+]/g, '');
				// If starts with +, remove + for wa.me format
				if (s.startsWith('+')) s = s.slice(1);
				// If starts with 0, try adding country code 254 (editable by admin/user)
				if (s.length > 0 && s.startsWith('0')) {
					// default to Kenya country code 254 (user can edit in modal)
					s = '254' + s.slice(1);
				}
				return s;
			}

			waBtn && waBtn.addEventListener('click', () => {
				if (!waModal) return;
				waModal.setAttribute('aria-hidden', 'false');
				waModal.style.display = 'flex';
				// focus number for quick edit
				setTimeout(() => waNumber && waNumber.focus(), 100);
			});

			waClose && waClose.addEventListener('click', () => {
				waModal.setAttribute('aria-hidden', 'true');
				waModal.style.display = 'none';
			});
			cancelWa && cancelWa.addEventListener('click', () => {
				waModal.setAttribute('aria-hidden', 'true');
				waModal.style.display = 'none';
			});

			openWa && openWa.addEventListener('click', () => {
				const num = sanitizeNumber(waNumber && waNumber.value);
				const msg = (waMessage && waMessage.value) || '';
				if (!num) { alert('Please enter a phone number to connect via WhatsApp.'); return; }
				const url = `https://wa.me/${encodeURIComponent(num)}?text=${encodeURIComponent(msg)}`;
				window.open(url, '_blank');
				waModal.setAttribute('aria-hidden', 'true');
				waModal.style.display = 'none';
			});
		})();

		if (applyDiscountBtn) {
			applyDiscountBtn.addEventListener('click', () => {
				if (currentDiscount) {
					localStorage.setItem('wheelDiscount', JSON.stringify(currentDiscount));
					wheelModal.setAttribute('aria-hidden', 'true');
					wheelModal.style.display = 'none';
					const svg = document.querySelector('.discount-wheel');
					if (svg) svg.style.transform = 'rotate(0deg)';
					const subscribeBtn = byId('subscribeBtn');
					if (subscribeBtn) subscribeBtn.click();
				}
			});
		}

		drawWheel();
	})();

})();