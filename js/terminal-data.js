// Data for interactive terminal CV
window.CV_DATA = (function(){
  const about = `Hello! I am Claudiu Morogan. SQL Developer, Web Developer and Software Engineer.\n\nI am a programmer passionate about creating new things and learning new technologies. Team player, collaborative and curious.`;

  const basic = [
    ['Age', '36'],
    ['Email', 'contact@claudiu-morogan.dev'],
    ['Languages', 'Romanian (native), English (Advanced)']
  ];

  const skills = [
    ['PL/SQL', 80],
    ['MySQL', 75],
    ['PHP', 60],
    ['HTML', 80],
    ['CSS / Bootstrap', 75],
    ['Python', 30]
  ];

  const experience = [
    { period:'Aug 2023 - Present', company:'Global Business Associates', role:'PHP & PL/SQL Developer', bullets:[
      'PL/SQL development per requirements',
      'Oracle database maintenance & development',
      'PHP application development & maintenance'
    ]},
    { period:'Nov 2022 - Jul 2023', company:'Wolters Kluwer', role:'Senior Engineer / PHP Developer', bullets:[
      'LexForce platform PHP feature development',
      'Database schema design & optimization',
      'Light Linux server configuration',
      'Docker environment setup',
      'Git workflow optimization'
    ]},
    { period:'Mar 2020 - Nov 2022', company:'Oracle', role:'APEX PL/SQL Developer', bullets:[
      'Design & build PL/SQL packages / APEX UI',
      'Custom SQL queries & functions',
      'Database design per app needs'
    ]},
    { period:'Oct 2017 - Mar 2020', company:'Orange Romania', role:'Reporting Specialist Developer', bullets:[
      'PL/SQL development', 'Oracle & MySQL maintenance', 'PHP (CodeIgniter,Yii2) development', 'Automation with Talend OpenStudio'
    ]},
    { period:'Nov 2016 - Mar 2020', company:'Orange Services Romania', role:'Software Application Developer Engineer', bullets:[
      'PL/SQL & Oracle APEX development', 'Application maintenance'
    ]},
    { period:'Nov 2014 - Nov 2016', company:'NSRA', role:'Analyst Programmer', bullets:[
      'DB maintenance (MySQL, Oracle11G, MSSQL)', 'Internal PHP apps (CodeIgniter, Bootstrap, jQuery)', 'Legacy FoxPro & Delphi maintenance', 'Windows server configuration', 'Help-desk'
    ]},
    { period:'Jul 2014 - Nov 2014', company:'Smart Vision Solutions', role:'PHP BackEnd Developer', bullets:[
      'CodeIgniter & pure PHP', 'jQuery, Maps API, vanilla JS', 'MySQL', 'SVN versioning', 'xDebug/Selenium/manual testing'
    ]},
    { period:'Nov 2013 - Jul 2014', company:'Websem Publicity', role:'PHP Developer', bullets:[
      'Wordpress & OpenCart customization', 'Custom JS/jQuery scripts', 'MySQL', 'Deploy to production'
    ]},
    { period:'Mar 2013 - Sep 2013', company:'CLARISOFT TECHNOLOGIES ROM SRL', role:'Software Application Developer Engineer', bullets:[
      'Simple PHP, jQuery, CSS', 'SVN code review process', 'xDebug testing', 'Client spec implementation'
    ]}
  ];

  const education = [
    { period:'2011 - 2013', title:"Master's Degree", degree:'Master of Information Technology', school:'Romananian-American University of Bucharest', desc:'Advanced programming focus; extensive self-study; strong software development & frameworks foundation.' },
    { period:'2008 - 2011', title:"Bachelor's Degree", degree:'Bachelor of Computer Science', school:'Romananian-American University of Bucharest', desc:'Core computing fundamentals, algorithms, data structures, DB management, hands-on projects.' }
  ];

  function renderSkills(){
    return skills.map(([name,val])=>`${name.padEnd(16,' ')} ${String(val).padStart(3)}% ${'#'.repeat(Math.round(val/5)).padEnd(20,'.')}`).join('\n');
  }
  function renderBasic(){
    return basic.map(([k,v])=>`${k.padEnd(12,' ')}: ${v}`).join('\n');
  }
  function renderExperience(){
    return experience.map(e=>`[${e.period}] ${e.company}\n  Role: ${e.role}\n  - ${e.bullets.join('\n  - ')}`).join('\n\n');
  }
  function renderEducation(){
    return education.map(e=>`[${e.period}] ${e.degree} @ ${e.school}\n  ${e.desc}`).join('\n\n');
  }

  const help = `Available commands:\n  help                Show this help\n  about               About me\n  basic               Basic information\n  skills              Professional skills\n  experience          Work experience summary\n  education           Education history\n  contact             Contact details\n  open linkedin       Open Linkedin profile\n  open github         Open GitHub profile\n  download cv         Download PDF CV\n  clear               Clear the terminal\n  theme               Toggle light/dark\n  goto <section>      Scroll to section (about|skills|experience|education)\n  search <keyword>    Search in experience entries\n  ascii               Show ASCII header\n`;

  const ascii = [
    '   ____ _                _ _ _          __  __                                   ',
    '  / ___| |__   __ _  ___(_) | | ___ _ _|  \\ /  | ___ _ __ ___   ___  _ __   __ _  ',
    " | |   | '_ \\ / _` |/ __| | | |/ _ (_) | |\\/| |/ _ \\ '_ ` _ \\ / _ \\| '_ \\ / _` | ",
    ' | |___| | | | (_| | (__| | | |  __/_| | |  | |  __/ | | | | | (_) | | | | (_| | ',
    '  \\____|_| |_|\\__,_|\\___|_|_|_|\\___(_)_|_|  |_|\\___|_| |_| |_|\\___/|_| |_|\\__, | ',
    '                                                                        |___/      '
  ].join('\n');

  return { about, renderSkills, renderBasic, renderExperience, renderEducation, help, ascii };
})();
