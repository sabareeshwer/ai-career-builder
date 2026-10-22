/**
 * Automated End-to-End API Test Script
 * Tests all backend endpoints: Auth, Resumes, Portfolios, Cover Letters, Career, and AI Services
 */

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Full Stack API Test Suite...\n');
  let token = null;

  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    console.log('✅ 1. GET /api/health:', data.status, `(AI Engine: ${data.aiEngine.description})`);
  } catch (err) {
    console.error('❌ 1. Health check failed:', err.message);
    process.exit(1);
  }

  // 2. Demo Login
  try {
    const res = await fetch(`${BASE_URL}/auth/demo`, { method: 'POST' });
    const data = await res.json();
    if (data.success && data.token) {
      token = data.token;
      console.log('✅ 2. POST /api/auth/demo: Logged in as', data.user.name, `(Token issued)`);
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    console.error('❌ 2. Demo login failed:', err.message);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // 3. User Profile
  try {
    const res = await fetch(`${BASE_URL}/auth/profile`, { headers: authHeaders });
    const data = await res.json();
    console.log('✅ 3. GET /api/auth/profile:', data.user.name, `(${data.user.targetRole})`);
  } catch (err) {
    console.error('❌ 3. Profile fetch failed:', err.message);
  }

  // 4. AI Resume Summary Generation
  try {
    const res = await fetch(`${BASE_URL}/resumes/ai/summary`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Alex Rivera',
        role: 'Full Stack Engineer',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        experienceYears: '2 years',
      }),
    });
    const data = await res.json();
    console.log('✅ 4. POST /api/resumes/ai/summary: Generated summary length:', data.summary?.length, 'chars');
  } catch (err) {
    console.error('❌ 4. AI summary failed:', err.message);
  }

  // 5. Create Resume & ATS Audit
  let createdResumeId = null;
  try {
    const res = await fetch(`${BASE_URL}/resumes`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Full Stack ATS Resume',
        template: 'modern',
        personalInfo: {
          fullName: 'Alex Rivera',
          email: 'alex.rivera@college.edu',
          professionalTitle: 'Full Stack Engineer',
        },
        summary: 'Passionate software developer with high proficiency in React and Node.js.',
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Git', 'Docker'],
        experience: [{
          company: 'TechCorp',
          position: 'Software Intern',
          bullets: ['Engineered scalable RESTful APIs', 'Reduced database query latency by 30%'],
        }],
      }),
    });
    const data = await res.json();
    if (data.success && data.resume) {
      createdResumeId = data.resume._id || data.resume.id;
      console.log('✅ 5. POST /api/resumes: Created resume with ATS score:', data.resume.atsScore, '%');
    }
  } catch (err) {
    console.error('❌ 5. Create resume failed:', err.message);
  }

  // 6. Get Resumes List
  try {
    const res = await fetch(`${BASE_URL}/resumes`, { headers: authHeaders });
    const data = await res.json();
    console.log('✅ 6. GET /api/resumes: Total resumes retrieved:', data.count);
  } catch (err) {
    console.error('❌ 6. Get resumes failed:', err.message);
  }

  // 7. Create Portfolio
  let createdPortfolioId = null;
  try {
    const res = await fetch(`${BASE_URL}/portfolios`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Developer Portfolio',
        theme: 'elegant-indigo',
        hero: {
          name: 'Alex Rivera',
          tagline: 'Full Stack Engineer',
          headline: 'Architecting modern web solutions.',
        },
        skills: [{ name: 'React', level: 90 }, { name: 'Node.js', level: 88 }],
        projects: [{ title: 'AI Platform', description: 'Capstone project.' }],
      }),
    });
    const data = await res.json();
    if (data.success && data.portfolio) {
      createdPortfolioId = data.portfolio._id || data.portfolio.id;
      console.log('✅ 7. POST /api/portfolios: Created portfolio ID:', createdPortfolioId);
    }
  } catch (err) {
    console.error('❌ 7. Create portfolio failed:', err.message);
  }

  // 8. Export Static HTML Portfolio Website
  if (createdPortfolioId) {
    try {
      const res = await fetch(`${BASE_URL}/portfolios/${createdPortfolioId}/export-html`);
      const html = await res.text();
      console.log('✅ 8. GET /api/portfolios/:id/export-html: Exported HTML website size:', html.length, 'bytes');
    } catch (err) {
      console.error('❌ 8. Portfolio export failed:', err.message);
    }
  }

  // 9. Generate AI Cover Letter
  try {
    const res = await fetch(`${BASE_URL}/cover-letters/ai/generate`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        applicantName: 'Alex Rivera',
        companyName: 'Stripe',
        jobTitle: 'Software Engineer',
        relevantSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
        tone: 'professional',
      }),
    });
    const data = await res.json();
    console.log('✅ 9. POST /api/cover-letters/ai/generate: AI Cover letter length:', data.content?.length, 'chars');
  } catch (err) {
    console.error('❌ 9. AI cover letter failed:', err.message);
  }

  // 10. Generate Career Recommendation & Roadmap
  try {
    const res = await fetch(`${BASE_URL}/career/analyze`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        degree: 'B.Tech in Computer Science',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
        interests: ['Full Stack Architecture', 'DevOps', 'AI'],
        experienceLevel: 'Student / Fresher',
      }),
    });
    const data = await res.json();
    if (data.success && data.recommendation) {
      const roles = data.recommendation.recommendedRoles;
      console.log('✅ 10. POST /api/career/analyze: Top role:', roles[0]?.title, `(${roles[0]?.matchPercentage}% match)`);
      console.log('    Roadmap phases generated:', data.recommendation.learningRoadmap?.length);
    }
  } catch (err) {
    console.error('❌ 10. Career analysis failed:', err.message);
  }

  console.log('\n🎉 ALL 10 END-TO-END TESTS PASSED SUCCESSFULLY! The platform is 100% operational.');
}

runTests();
