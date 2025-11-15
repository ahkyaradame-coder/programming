// script for Learn Programming site
(function(){
	// Simple course data; in a real site this would come from an API
	const courses = [
		{id:1,title:'JavaScript Essentials',level:'beginner',desc:'Core JS fundamentals and DOM manipulation. Build interactive web apps.'},
		{id:2,title:'Python for Data',level:'intermediate',desc:'Learn Python and analyze data with pandas and visualization.'},
		{id:3,title:'Full-Stack Web',level:'advanced',desc:'Build and deploy a full-stack app with Node, React, and Postgres.'},
		{id:4,title:'Intro to HTML & CSS',level:'beginner',desc:'Foundations of the web: structure, styling, and responsive layouts.'},
		{id:5,title:'APIs & Backends',level:'intermediate',desc:'Design RESTful APIs and work with authentication and databases.'},
		{id:6,title:'DevOps Basics',level:'advanced',desc:'CI/CD, containers, and deployment best practices for developers.'}
	];

	function byId(id){return document.getElementById(id)}
	const courseGrid = byId('courseGrid');
	const search = byId('search');
	const levelFilter = byId('levelFilter');
	const heroCTA = byId('heroCTA');
	const startBtn = byId('startBtn');

	function createCard(c){
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

	function render(list){
		courseGrid.innerHTML = '';
		if(!list.length){
			courseGrid.innerHTML = '<div class="muted">No courses found.</div>';
			return;
		}
		list.forEach(c => courseGrid.appendChild(createCard(c)));
	}

	function filterCourses(){
		const q = (search.value||'').trim().toLowerCase();
		const level = levelFilter.value;
		const out = courses.filter(c => {
			const inLevel = level === 'all' ? true : c.level === level;
			const inQuery = q === '' ? true : (c.title + ' ' + c.desc).toLowerCase().indexOf(q) !== -1;
			return inLevel && inQuery;
		});
		render(out);
	}

	// FAQ accordion
	function initFAQ(){
		const faqItems = document.querySelectorAll('.faq-item');
		faqItems.forEach(btn => {
			btn.addEventListener('click', ()=>{
				btn.classList.toggle('open');
			});
		});
	}

	// smooth scrolling for hero CTAs
	function smoothTo(selector){
		const el = document.querySelector(selector);
		if(!el) return;
		el.scrollIntoView({behavior:'smooth',block:'start'});
	}

	// wire events
	document.addEventListener('DOMContentLoaded', ()=>{
		render(courses);
		initFAQ();
		byId('year').textContent = new Date().getFullYear();

		search.addEventListener('input', debounce(filterCourses, 180));
		levelFilter.addEventListener('change', filterCourses);

		heroCTA.addEventListener('click', ()=> smoothTo('#courses'));
		startBtn && startBtn.addEventListener('click', ()=> smoothTo('#courses'));

		// contact form simple handler
		const contactForm = byId('contactForm');
		contactForm.addEventListener('submit', (ev)=>{
			ev.preventDefault();
			const name = byId('name').value || 'Friend';
			alert(`Thanks, ${name}! We'll get back to you soon.`);
			contactForm.reset();
		});

		// delegate view/enroll buttons
		courseGrid.addEventListener('click', (ev)=>{
			const btn = ev.target.closest('.enroll');
			if(!btn) return;
			const id = btn.dataset.id;
			const course = courses.find(c => String(c.id) === String(id));
			if(course) alert(`${course.title}\n\n${course.desc}`);
		});
			// Generate JSON-LD structured data dynamically from the courses array
			try{
				injectStructuredData(courses);
			}catch(e){
				// if structured data fails we don't want to break the page
				console.warn('Structured data injection failed', e);
			}
	});

	function debounce(fn, wait){
		let t;
		return function(){
			clearTimeout(t);
			t = setTimeout(()=> fn.apply(this, arguments), wait);
		};
	}

		/* Structured Data: create JSON-LD for Organization, WebSite and Course items.
			 This improves search engines' understanding of the site and courses. */
		function injectStructuredData(courseList){
			const domain = 'https://example.com'; // <-- Replace with your production domain
			const coursesLd = courseList.map(c => ({
				'@type':'Course',
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
						'@type':'WebSite',
						'name':'CodeLearn',
						'url': domain,
						'potentialAction': {
							'@type': 'SearchAction',
							'target': `${domain}/?q={search_term_string}`,
							'query-input': 'required name=search_term_string'
						}
					},
					{
						'@type':'Organization',
						'name':'CodeLearn',
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

})();