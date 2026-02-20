// pages/api/submit-application.js
export default async function handler(req, res) {
  console.log('🚀 API called with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method allowed' });
  }

  let connection;

  try {
    console.log('📦 Loading mysql2...');
    const mysql = require('mysql2/promise');
    console.log('✅ mysql2 loaded successfully');

    // Get form data
    const { personalInfo, projects, candidateJobs, qualifications, skills } = req.body;
    
    console.log('📋 Received data keys:', Object.keys(req.body));
    console.log('👤 Personal info keys:', Object.keys(personalInfo || {}));

    if (!personalInfo) {
      return res.status(400).json({ error: 'Personal info is required' });
    }

    // Database connection (from env or defaults for local dev)
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'job_applications',
      port: parseInt(process.env.DB_PORT || '3306', 10)
    });
    console.log('✅ Database connected successfully');

    // Insert main application data with all fields
    console.log('💾 Inserting main application data...');
    const [applicationResult] = await connection.execute(`
      INSERT INTO applications 
      (name, surname, email, phone, date_of_birth, job_category, password, 
       address, country, city, state, place_of_birth, passport_number, 
       gender, abroad_residence_address, weight, height, programming_languages, 
       experience, medical_license, specialization, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      personalInfo.name || null,
      personalInfo.surname || null,
      personalInfo.email || null,
      personalInfo.phone || null,
      personalInfo.dateOfBirth || null,
      personalInfo.jobCategory || null,
      personalInfo.password || null,
      personalInfo.address || null,
      personalInfo.country || null,
      personalInfo.city || null,
      personalInfo.state || null,
      personalInfo.placeOfBirth || null,
      personalInfo.passportNumber || null,
      personalInfo.gender || null,
      personalInfo.abroadResidenceAddress || null,
      personalInfo.weight ? parseFloat(personalInfo.weight) : null,
      personalInfo.height ? parseFloat(personalInfo.height) : null,
      personalInfo.programmingLanguages || null,
      personalInfo.experience ? parseInt(personalInfo.experience) : null,
      personalInfo.medicalLicense || null,
      personalInfo.specialization || null
    ]);

    const applicationId = applicationResult.insertId;
    console.log('✅ Application inserted with ID:', applicationId);

    let experienceCount = 0;

    // Insert projects if they exist
    if (projects && Array.isArray(projects) && projects.length > 0) {
      console.log('📁 Inserting projects...');
      for (const project of projects) {
        if (project.title || project.organization) {
          await connection.execute(`
            INSERT INTO experiences 
            (application_id, type, title, organization, start_date, end_date, reference) 
            VALUES (?, 'project', ?, ?, ?, ?, ?)
          `, [
            applicationId,
            project.title || null,
            project.organization || null,
            project.startDate || null,
            project.endDate || null,
            project.reference || null
          ]);
          experienceCount++;
        }
      }
      console.log(`✅ Inserted ${experienceCount} projects`);
    }

    // Insert work experience if it exists
    if (candidateJobs && Array.isArray(candidateJobs) && candidateJobs.length > 0) {
      console.log('💼 Inserting work experience...');
      let jobCount = 0;
      for (const job of candidateJobs) {
        if (job.title || job.organization) {
          await connection.execute(`
            INSERT INTO experiences 
            (application_id, type, title, organization, start_date, end_date, reference) 
            VALUES (?, 'work', ?, ?, ?, ?, ?)
          `, [
            applicationId,
            job.title || null,
            job.organization || null,
            job.startDate || null,
            job.endDate || null,
            job.reference || null
          ]);
          jobCount++;
        }
      }
      console.log(`✅ Inserted ${jobCount} work experiences`);
    }

    // Insert qualifications if they exist
    if (qualifications && Array.isArray(qualifications) && qualifications.length > 0) {
      console.log('🎓 Inserting qualifications...');
      let qualCount = 0;
      for (const qual of qualifications) {
        if (qual.title || qual.organization) {
          await connection.execute(`
            INSERT INTO experiences 
            (application_id, type, title, organization, start_date, end_date, reference) 
            VALUES (?, 'qualification', ?, ?, ?, ?, ?)
          `, [
            applicationId,
            qual.title || null,
            qual.organization || null,
            qual.startDate || null,
            qual.endDate || null,
            qual.reference || null
          ]);
          qualCount++;
        }
      }
      console.log(`✅ Inserted ${qualCount} qualifications`);
    }

    // Insert skills if they exist
    if (skills && Array.isArray(skills) && skills.length > 0) {
      console.log('⭐ Inserting skills...');
      let skillCount = 0;
      for (const skill of skills) {
        if (skill.title || skill.organization) {
          await connection.execute(`
            INSERT INTO experiences 
            (application_id, type, skill_type, title, organization, start_date, end_date, reference) 
            VALUES (?, 'skill', ?, ?, ?, ?, ?, ?)
          `, [
            applicationId,
            skill.type || null,
            skill.title || null,
            skill.organization || null,
            skill.startDate || null,
            skill.endDate || null,
            skill.reference || null
          ]);
          skillCount++;
        }
      }
      console.log(`✅ Inserted ${skillCount} skills`);
    }

    console.log('🎉 All data inserted successfully!');

    // Success response
    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: applicationId,
      experiencesInserted: experienceCount
    });

  } catch (error) {
    console.error('💥 ERROR:', error.message);
    console.error('📍 Error stack:', error.stack);
    console.error('🔍 Error code:', error.code);
    
    res.status(500).json({
      success: false,
      error: 'Failed to save application',
      details: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Database connection closed');
    }
  }
} 