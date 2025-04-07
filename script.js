async function initialize() {
  const user = await window.websim.getUser();
  if (!user) return;

  // Set user info
  document.getElementById('username').textContent = '@' + user.username;
  document.getElementById('avatar').src = `https://images.websim.ai/avatar/${user.username}`;

  // Fetch and set user stats
  const statsResponse = await fetch(`/api/v1/users/${user.username}/stats`);
  const statsData = await statsResponse.json();
  document.getElementById('total-views').textContent = statsData.stats.total_views.toLocaleString();
  document.getElementById('total-likes').textContent = statsData.stats.total_likes.toLocaleString();

  // Fetch followers count
  const followersResponse = await fetch(`/api/v1/users/${user.username}/followers?count=true`);
  const followersData = await followersResponse.json();
  document.getElementById('followers-count').textContent = followersData.followers.meta.count.toLocaleString();

  // Fetch and display projects
  const projectsResponse = await fetch(`/api/v1/users/${user.username}/projects?posted=true`);
  const projectsData = await projectsResponse.json();
  
  const projectsGrid = document.getElementById('projects-grid');
  projectsGrid.innerHTML = ''; // Clear any existing content

  projectsData.projects.data.forEach(({project, site}) => {
    if (!project || !site) return;
    
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.onclick = () => window.location.href = `https://websim.ai/p/${project.id}`;

    projectCard.innerHTML = `
      <img class="project-image" src="https://images.websim.ai/v1/site/${site.id}/600" alt="${project.title || 'Project'}" onerror="this.src='fallback.png'">
      <div class="project-info">
        <h3 class="project-title">${project.title || 'Untitled Project'}</h3>
        <div class="project-stats">
          <span>👁 ${project.stats.views.toLocaleString()}</span>
          <span>❤️ ${project.stats.likes.toLocaleString()}</span>
        </div>
      </div>
    `;

    projectsGrid.appendChild(projectCard);
  });
}

// Initialize when the page loads
initialize().catch(console.error);