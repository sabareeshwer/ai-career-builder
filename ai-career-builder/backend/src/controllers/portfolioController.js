const { Portfolio } = require('../models/Portfolio');

// @desc    Get user portfolios
// @route   GET /api/portfolios
// @access  Private
const getUserPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id });
    return res.json({ success: true, count: portfolios.length, portfolios });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get portfolio by ID
// @route   GET /api/portfolios/:id
// @access  Private / Public
const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    return res.json({ success: true, portfolio });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new portfolio
// @route   POST /api/portfolios
// @access  Private
const createPortfolio = async (req, res) => {
  try {
    const portfolioData = {
      ...req.body,
      user: req.user._id,
    };
    const portfolio = await Portfolio.create(portfolioData);
    return res.status(201).json({ success: true, portfolio, message: 'Portfolio saved successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update portfolio
// @route   PUT /api/portfolios/:id
// @access  Private
const updatePortfolio = async (req, res) => {
  try {
    const existing = await Portfolio.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    const updated = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, portfolio: updated, message: 'Portfolio updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete portfolio
// @route   DELETE /api/portfolios/:id
// @access  Private
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    await Portfolio.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Portfolio deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export portfolio as standalone single-file static HTML website
// @route   GET /api/portfolios/:id/export-html
// @access  Public / Private
const exportStaticHTML = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    const { hero, about, skills, projects, experience, education, contact, theme, title } = portfolio;
    const isDark = theme !== 'minimal-light';

    const bgGradient = isDark 
      ? 'background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%); color: #f8fafc;'
      : 'background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%); color: #0f172a;';

    const cardBg = isDark
      ? 'background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1);'
      : 'background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.05);';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${hero?.name || 'Developer'} - ${hero?.tagline || 'Portfolio'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; ${bgGradient} min-height: 100vh; line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    header { padding: 80px 0 60px; text-align: center; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); margin-bottom: 20px; }
    h1 { font-size: 3rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p.lead { font-size: 1.25rem; opacity: 0.85; max-width: 650px; margin: 0 auto 30px; }
    .links { display: flex; justify-content: center; gap: 16px; margin-bottom: 40px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; padding: 12px 26px; border-radius: 12px; font-weight: 600; text-decoration: none; transition: 0.2s ease; cursor: pointer; }
    .btn-primary { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(99, 102, 241, 0.5); }
    .btn-secondary { background: rgba(255,255,255,0.1); color: inherit; border: 1px solid rgba(255,255,255,0.2); }
    .btn-secondary:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }
    section { padding: 60px 0; }
    .section-title { font-size: 1.85rem; font-weight: 700; margin-bottom: 30px; text-align: center; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .card { ${cardBg} border-radius: 18px; padding: 24px; backdrop-filter: blur(12px); transition: transform 0.25s ease, box-shadow 0.25s ease; }
    .card:hover { transform: translateY(-4px); }
    .skill-pill { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; margin: 4px; }
    .proj-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
    .proj-desc { font-size: 0.95rem; opacity: 0.8; margin-bottom: 16px; }
    .tag-container { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .proj-tag { font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; background: rgba(255,255,255,0.08); }
    footer { text-align: center; padding: 50px 0 30px; opacity: 0.6; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">🚀 Available for Hire & Collaboration</div>
      <h1>${hero?.name || 'Your Name'}</h1>
      <p class="lead">${hero?.headline || hero?.tagline || 'Full Stack Engineer & AI Specialist'}</p>
      <div class="links">
        ${hero?.socials?.email ? `<a class="btn btn-primary" href="mailto:${hero.socials.email}">Contact Me</a>` : ''}
        ${hero?.socials?.github ? `<a class="btn btn-secondary" href="${hero.socials.github}" target="_blank">GitHub Profile</a>` : ''}
        ${hero?.socials?.linkedin ? `<a class="btn btn-secondary" href="${hero.socials.linkedin}" target="_blank">LinkedIn</a>` : ''}
      </div>
    </header>

    ${about?.story ? `
    <section>
      <h2 class="section-title">About Me</h2>
      <div class="card" style="max-width: 800px; margin: 0 auto; text-align: center;">
        <p style="font-size: 1.1rem; line-height: 1.8;">${about.story}</p>
        <div style="display: flex; justify-content: center; gap: 30px; margin-top: 24px;">
          <div><div style="font-size: 1.8rem; font-weight: 800; color: #818cf8;">${about.experienceYears || '2+'}</div><div style="font-size: 0.85rem; opacity: 0.7;">Years Exp</div></div>
          <div><div style="font-size: 1.8rem; font-weight: 800; color: #a855f7;">${about.projectsCount || '10+'}</div><div style="font-size: 0.85rem; opacity: 0.7;">Projects</div></div>
        </div>
      </div>
    </section>
    ` : ''}

    ${skills && skills.length > 0 ? `
    <section>
      <h2 class="section-title">Technical Expertise</h2>
      <div class="card" style="text-align: center; max-width: 850px; margin: 0 auto;">
        ${skills.map(s => `<span class="skill-pill">${s.name || s}</span>`).join('')}
      </div>
    </section>
    ` : ''}

    ${projects && projects.length > 0 ? `
    <section>
      <h2 class="section-title">Featured Projects</h2>
      <div class="grid">
        ${projects.map(p => `
          <div class="card">
            <div class="proj-title">${p.title}</div>
            <div class="proj-desc">${p.description}</div>
            ${p.tags && p.tags.length > 0 ? `
              <div class="tag-container">
                ${p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}
              </div>
            ` : ''}
            <div style="display: flex; gap: 12px;">
              ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.85rem;">Live Demo</a>` : ''}
              ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">Source Code</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    ${experience && experience.length > 0 ? `
    <section>
      <h2 class="section-title">Experience & Journey</h2>
      <div class="grid">
        ${experience.map(e => `
          <div class="card">
            <h3 style="font-size: 1.15rem; font-weight: 700;">${e.role}</h3>
            <div style="color: #818cf8; font-weight: 600; margin-bottom: 6px;">${e.company} • ${e.duration || ''}</div>
            <p style="opacity: 0.8; font-size: 0.9rem;">${e.description}</p>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <section>
      <h2 class="section-title">Get In Touch</h2>
      <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
        <p style="margin-bottom: 20px;">Interested in building something exceptional together? Let's talk.</p>
        <a class="btn btn-primary" href="mailto:${contact?.email || hero?.socials?.email || 'hello@example.com'}">
          Send An Email
        </a>
      </div>
    </section>

    <footer>
      Generated with ❤️ by AI Career Builder • Static Portfolio Export
    </footer>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="portfolio-${req.params.id}.html"`);
    return res.send(htmlContent);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  exportStaticHTML,
};
