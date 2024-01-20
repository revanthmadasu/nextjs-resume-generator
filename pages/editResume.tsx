import type { NextPage } from 'next';
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { PersonalData, ResumeData } from '../types/cv_types';
import { CV1 } from '../components/CV';
import DescriptionTextBox from '../components/DescriptionTextBox';


const EditResume = (): NextPage => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [personalData, setPersonalData] = useState<PersonalData>({
    name: '',
    website: {
      readable: '',
      link: '',
    },
    email: {
      readable: '',
      link: '',
    },
    github: {
      readable: '',
      link: '',
    },
    linkedin: {
      readable: '',
      link: '',
    },
    skillset: [],
  });

  
  const [newSkillset, setNewSkillset] = useState({
      type: '',
      label: '',
      skills: [{ skill: '', level: '' }],
    });
    
    const [workExperience, setWorkExperience] = useState([
        {
            company: '',
            position: '',
            url: '',
            location: '',
            start: '',
            end: '',
            description: [''],
        },
    ]);
    
    const [newWorkExperience, setNewWorkExperience] = useState({
        company: '',
        position: '',
        url: '',
        location: '',
        start: '',
        end: '',
        description: [''],
    });
    
    const [education, setEducation] = useState([
        {
            degree: '',
            university: '',
            url: '',
            location: '',
            start: '',
            end: '',
            description: [''],
        },
    ]);
    
    const [newEducation, setNewEducation] = useState({
        degree: '',
        university: '',
        url: '',
        location: '',
        start: '',
        end: '',
        description: [''],
    });
    
    const resumeData = useMemo<ResumeData>(() => {
        return {
            "personal": personalData,
            "work_experience": workExperience,
            "education": education
        }
    }, [personalData, workExperience, education]);

    const resumeDataJsonStr = useMemo(() => JSON.stringify(resumeData, null, "\t"), [resumeData]);
    
  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newPerData = {...personalData};
    const keys = name.split(".");
    let targetRef: any = newPerData;
    for (let i=0; i<keys.length-1; ++i) {
        targetRef = targetRef[keys[i]]
    }
    targetRef[keys[keys.length-1]] = value;
    // setPersonalData({
    //   ...personalData,
    //   [name]: value,
    // });
    setPersonalData({
        ...newPerData
      });
  };

  const handleDescriptionChange = useCallback((type: string, index: number, descItems: string[]) => {
    if (type === 'work_experience') {
      workExperience[index].description = descItems;
      setWorkExperience([...workExperience]);
    } else if (type === 'education') {
      education[index].description = descItems;
      setEducation([...education]);
    }
  }, []);

  const onImportData = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target && e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        console.log(`Selected file: ${selectedFile.name}`);
        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            console.log("file loaded");
            const fileContent = event.target?.result;
            if (fileContent) {
              const resumeObject: ResumeData = JSON.parse(fileContent as string);
              console.log('Setting Resume Data');
              if (resumeObject.personal) {
                setPersonalData(resumeObject.personal);
              }
              if (resumeObject.work_experience) {
                setWorkExperience(resumeObject.work_experience)
              }
              if (resumeObject.education) {
                setEducation(resumeObject.education)
              }
            }
          };
          reader.readAsText(selectedFile);
        } catch (error) {
          console.error('Error reading or parsing the JSON file:', error);
        }
      }
    }
  }, []);
  
  const onFileUploadClick = useCallback(() => {
    if (fileInputRef && fileInputRef.current)
    fileInputRef.current.click();
  }, []);

  const handleSkillsetChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const updatedSkillset = [...personalData.skillset];
    updatedSkillset[index][name] = value;
    setPersonalData({
      ...personalData,
      skillset: updatedSkillset,
    });
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>, skillSetIndex: number, skillIndex: number) => {
    const { name, value } = e.target;
    personalData.skillset[skillSetIndex].skills[skillIndex][name] = value;
    setPersonalData({
        ...personalData,
    });
  };

  const addSkill = (index: number) => {
    const updatedSkillset = [...personalData.skillset];
    updatedSkillset[index].skills.push({ skill: '', level: '' });
    setPersonalData({
      ...personalData,
      skillset: updatedSkillset,
    });
  };

  const deleteSkill = (skillsetIndex: number, skillIndex: number) => {
    const updatedSkillset = [...personalData.skillset];
    updatedSkillset[skillsetIndex].skills.splice(skillIndex, 1);
    setPersonalData({
      ...personalData,
      skillset: updatedSkillset,
    });
  };

  const addSkillset = () => {
    setPersonalData({
      ...personalData,
      skillset: [...personalData.skillset, newSkillset],
    });
    setNewSkillset({
      type: '',
      label: '',
      skills: [{ skill: '', level: '' }],
    });
  };

  const deleteSkillset = (index: number) => {
    const updatedSkillset = [...personalData.skillset];
    updatedSkillset.splice(index, 1);
    setPersonalData({
      ...personalData,
      skillset: updatedSkillset,
    });
  };

  const handleWorkExperienceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const updatedWorkExperience = [...workExperience];
    updatedWorkExperience[index][name] = value;
    setWorkExperience(updatedWorkExperience);
  };

  const handleWorkExperienceDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, experienceIndex: number, descIndex: number) => {
    const { value } = e.target;
    const updatedWorkExperience = [...workExperience];
    updatedWorkExperience[experienceIndex].description[descIndex] = value;
    setWorkExperience(updatedWorkExperience);
  };

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, newWorkExperience]);
    setNewWorkExperience({
      company: '',
      position: '',
      url: '',
      location: '',
      start: '',
      end: '',
      description: [''],
    });
  };

  const deleteWorkExperience = (index: number) => {
    const updatedWorkExperience = [...workExperience];
    updatedWorkExperience.splice(index, 1);
    setWorkExperience(updatedWorkExperience);
  };

// Method to handle changes in education fields
const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const updatedEducation = [...education];
    updatedEducation[index][name] = value;
    setEducation(updatedEducation);
  };
  
  // Method to handle changes in education description fields
  const handleEducationDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>, eduIndex: number, descIndex: number) => {
    const { value } = e.target;
    const updatedEducation = [...education];
    updatedEducation[eduIndex].description[descIndex] = value;
    setEducation(updatedEducation);
  };
  
  // Method to add a new education entry
  const addEducation = () => {
    setEducation([...education, newEducation]);
    setNewEducation({
      degree: '',
      university: '',
      url: '',
      location: '',
      start: '',
      end: '',
      description: [''],
    });
  };
  
  // Method to delete an education entry
  const deleteEducation = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  };

  return (
    <div className="container h-screen">
        <div className="flex h-full">
            <div className="flex-none w-96 h-full overflow-auto resume-data-input">
                <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Resume Form</h1>

                <span className="flex flex-row place-content-between mt-4 mb-2">
                  <span className="text-2xl">
                    Personal Data
                  </span>
                  <button className="bg-orange-500 p-2 rounded" onClick={onFileUploadClick}>
                    <input type="file" ref={fileInputRef} className='hidden' onChange={onImportData}/>
                    <span className="flex flex-row">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                      <span className='pl-1'>
                        Import
                      </span>
                    </span>
                  </button>
                </span>
                <label className="block mb-2">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={personalData.name}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mb-4"
                />

                {/* Other personal data fields go here, similar to 'Name' */}
                    <label className="block mb-2">Website Readable:</label>
                    <input
                    type="text"
                    name="website.readable"
                    value={personalData.website.readable}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <label className="block mb-2">Website Link:</label>
                    <input
                    type="text"
                    name="website.link"
                    value={personalData.website.link}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <label className="block mb-2">Email Readable:</label>
                    <input
                    type="text"
                    name="email.readable"
                    value={personalData.email.readable}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <label className="block mb-2">Email Link:</label>
                    <input
                    type="text"
                    name="email.link"
                    value={personalData.email.link}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <label className="block mb-2">GitHub Readable:</label>
                    <input
                    type="text"
                    name="github.readable"
                    value={personalData.github.readable}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <label className="block mb-2">GitHub Link:</label>
                    <input
                    type="text"
                    name="github.link"
                    value={personalData.github.link}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <label className="block mb-2">LinkedIn Readable:</label>
                    <input
                    type="text"
                    name="linkedin.readable"
                    value={personalData.linkedin.readable}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <label className="block mb-2">LinkedIn Link:</label>
                    <input
                    type="text"
                    name="linkedin.link"
                    value={personalData.linkedin.link}
                    onChange={handlePersonalDataChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                <h2 className="text-2xl mt-4 mb-2">Skillset</h2>
                {personalData.skillset.map((skillset, skillsetIndex) => (
                    <div key={skillsetIndex} className="bg-gray-800 p-4 mb-4 rounded-md">
                    <label className="block mb-2">Type:</label>
                    <input
                        type="text"
                        name="type"
                        value={skillset.type}
                        onChange={(e) => handleSkillsetChange(e, skillsetIndex)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <label className="block mb-2">Label:</label>
                    <input
                        type="text"
                        name="label"
                        value={skillset.label}
                        onChange={(e) => handleSkillsetChange(e, skillsetIndex)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                    />
                    <h3 className="text-xl mt-2 mb-2">Skills</h3>
                    {skillset.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="bg-gray-700 p-2 mb-2 rounded-md">
                        <label className="block mb-2">Skill:</label>
                        <input
                            type="text"
                            name="skill"
                            value={skill.skill}
                            onChange={(e) =>
                            handleSkillChange(e, skillsetIndex, skillIndex)
                            }
                            className="w-full bg-gray-600 border border-gray-500 rounded-md p-1 mb-1"
                        />
                        <label className="block mb-2">Level:</label>
                        <input
                            type="text"
                            name="level"
                            value={skill.level}
                            onChange={(e) =>
                                handleSkillChange(e, skillsetIndex, skillIndex)
                            }
                            className="w-full bg-gray-600 border border-gray-500 rounded-md p-1 mb-1"
                        />
                        <button
                            onClick={() => deleteSkill(skillsetIndex, skillIndex)}
                            className="text-red-500 hover:text-red-600 font-bold mt-2"
                        >
                            Delete Skill
                        </button>
                        </div>
                    ))}
                    <button
                        onClick={() => addSkill(skillsetIndex)}
                        className="text-blue-500 hover:text-blue-600 font-bold mt-2"
                    >
                        Add Skill
                    </button>
                    <button
                        onClick={() => deleteSkillset(skillsetIndex)}
                        className="text-red-500 hover:text-red-600 font-bold mt-2 ml-2"
                    >
                        Delete Skillset
                    </button>
                    </div>
                ))}
                <button
                    onClick={addSkillset}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                >
                    Add Skillset
                </button>

                        {/* Work Experience Section */}
                        <h2 className="text-2xl mt-4 mb-2">Work Experience</h2>
                {workExperience.map((experience, index) => (
                    <div key={index} className="bg-gray-800 p-4 mb-4 rounded-md">
            <label className="block mb-2">Company:</label>
            <input
                type="text"
                name="company"
                value={experience.company}
                onChange={(e) => handleWorkExperienceChange(e, index)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
            />
            <label className="block mb-2">Position:</label>
            <input
                type="text"
                name="position"
                value={experience.position}
                onChange={(e) => handleWorkExperienceChange(e, index)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
            />
            <label className="block mb-2">URL:</label>
            <input
                type="text"
                name="url"
                value={experience.url}
                onChange={(e) => handleWorkExperienceChange(e, index)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
            />
            <label className="block mb-2">Location:</label>
            <input
                type="text"
                name="location"
                value={experience.location}
                onChange={(e) => handleWorkExperienceChange(e, index)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
            />
            <label className="block mb-2">Start Date:</label>
            <input
                type="text"
                name="start"
                value={experience.start}
                onChange={(e) => handleWorkExperienceChange(e, index)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
            />
            <label className="block mb-2">End Date:</label>
            <input
                type="text"
                name="end"
                value={experience.end}
                onChange={(e) => handleWorkExperienceChange(e, index)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
            />
            <h3 className="text-xl mt-2 mb-2">Description</h3>
            <DescriptionTextBox descItems={workExperience[index].description} type='work_experience' index={index} handleDescriptionChange={handleDescriptionChange}/>
            <button
                onClick={() => deleteWorkExperience(index)}
                className="text-red-500 hover:text-red-600 font-bold mt-2 ml-2"
            >
                Delete Experience
            </button>
            </div>
                ))}
                    <button
                        onClick={() => addWorkExperience()}
                        className="text-blue-500 hover:text-blue-600 font-bold mt-2"
                    >
                        Add Work Experience
                    </button>

                    {/* Education Section */}
                    <h2 className="text-2xl mt-4 mb-2">Education</h2>
                    {education.map((edu, index) => (
                    <div key={index} className="bg-gray-800 p-4 mb-4 rounded-md">
                        <label className="block mb-2">Degree:</label>
                        <input
                        type="text"
                        name="degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(e, index)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-2"
                        />
                        {/* Add similar fields for university, location, URL, start, end */}
                        <h3 className="text-xl mt-2 mb-2">Description</h3>
                        <DescriptionTextBox descItems={education[index].description} type='education' index={index} handleDescriptionChange={handleDescriptionChange}/>
                        <button
                        onClick={() => deleteEducation(index)}
                        className="text-red-500 hover:text-red-600 font-bold mt-2 ml-2"
                        >
                        Delete Education
                        </button>
                    </div>
                    ))}
                    <button
                        onClick={() => addEducation()}
                        className="text-blue-500 hover:text-blue-600 font-bold mt-2"
                    >
                        Add Education
                    </button>
                </div>
                <div>
                    {resumeDataJsonStr}
                </div>
            </div>
            <div className="flex-auto resume">
                <CV1 {...resumeData} />
            </div>
        </div>
    </div>
  );
};


export default EditResume;