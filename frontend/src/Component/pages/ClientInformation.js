import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const ClientInformation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', age: '', dob: '', email: '', mobile: '',
        maritalStatus: '', address: '', pinCode: '', state: '', district: '',
        job: '', company: '', stressReasons: [],
        father: '', mother: '', spouse: '', children: '',
        grandfather: '', grandmother: '', sister: '', brother: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedReasons = [...formData.stressReasons];
        if (checked) updatedReasons.push(value);
        else updatedReasons = updatedReasons.filter((r) => r !== value);
        setFormData({ ...formData, stressReasons: updatedReasons });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userId = localStorage.getItem('user_id');

        // मॉडेलच्या snake_case फील्ड्सनुसार डेटा मॅप केला आहे
        const dataToSend = {
            user: userId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            age: parseInt(formData.age) || 0,
            dob: formData.dob,
            email: formData.email,
            mobile: formData.mobile,
            marital_status: formData.maritalStatus,
            address: formData.address,
            pin_code: formData.pinCode,
            state: formData.state,
            district: formData.district,
            job: formData.job || null,
            company: formData.company || null,
            stress_reason: formData.stressReasons, // JSONField साठी Array पाठवत आहोत
            father: formData.father || null,
            mother: formData.mother || null,
            spouse: formData.spouse || null,
            children: formData.children || null,
            grandfather: formData.grandfather || null,
            grandmother: formData.grandmother || null,
            sister: formData.sister || null,
            brother: formData.brother || null,
            marks: {} // मॉडेलमधील JSONField साठी रिकामी डिक्शनरी
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/client-information/', dataToSend);
            if (response.status === 201) {
                alert("Information saved successfully!");
                navigate('/');
            }
        } catch (error) {
            console.error("Backend Error:", error.response?.data);
            const errorMsg = error.response?.data
                ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join('\n')
                : "Failed to save. Check your connection.";
            alert("Error:\n" + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-info-container">
            <style>{`
                :root { --primary: #4f46e5; --bg: #f3f4f6; --text: #1f2937; --border: #d1d5db; }
                .client-info-container { max-width: 1000px; margin: 2rem auto; font-family: 'Segoe UI', sans-serif; padding: 0 1rem; }
                .info-form { background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-top: 1rem; }
                .section-title { font-size: 1.25rem; color: var(--primary); font-weight: 700; margin: 0; }
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 1rem; }
                .form-group { display: flex; flex-direction: column; gap: 5px; }
                .form-label { font-size: 0.9rem; font-weight: 600; color: #4b5563; }
                .required { color: #ef4444; }
                .form-input { padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.5rem; font-size: 1rem; }
                .form-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
                .checkbox-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
                .pill-option input { display: none; }
                .pill-label { padding: 0.6rem 1.2rem; background: #f3f4f6; border-radius: 2rem; font-size: 0.9rem; border: 1px solid transparent; cursor: pointer; transition: 0.3s; }
                .pill-option input:checked + .pill-label { background: var(--primary); color: white; }
                .btn-submit { width: 100%; padding: 1.2rem; background: var(--primary); color: white; border: none; border-radius: 0.5rem; font-weight: 700; cursor: pointer; font-size: 1.1rem; transition: 0.3s; }
                .btn-submit:disabled { background: #9ca3af; cursor: not-allowed; }
            `}</style>

            <form className="info-form" onSubmit={handleSubmit}>

              {/* 1. PERSONAL INFO */}
              <section className="form-section">
                <div className="section-header">
                  <h2 className="section-title">👤 {t("personal_title")}</h2>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      {t("first_name")} <span className="required">*</span>
                    </label>
                    <input type="text" name="firstName" className="form-input" onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {t("last_name")} <span className="required">*</span>
                    </label>
                    <input type="text" name="lastName" className="form-input" onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">

                      {t("email")} <span className="required">*</span>
                    </label>
                    <input type="email" name="email" className="form-input" onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {t("mobile")} <span className="required">*</span>
                    </label>
                    <input type="tel" name="mobile" className="form-input" onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {t("age")} <span className="required">*</span>
                    </label>
                    <input type="number" name="age" className="form-input" onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {t("dob")} <span className="required">*</span>
                    </label>
                    <input type="date" name="dob" className="form-input" onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label className="form-label">
                    {t("marital_status")} *
                  </label>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <label>
                      <input type="radio" name="maritalStatus" value="married" onChange={handleChange} required />
                      {t("married")}
                    </label>

                    <label>
                      <input type="radio" name="maritalStatus" value="unmarried" onChange={handleChange} />
                      {t("unmarried")}
                    </label>
                  </div>
                </div>
              </section>


              {/* 2. ADDRESS */}
              <section className="form-section">
                <div className="section-header">
                  <h2 className="section-title">{t("address_title")}</h2>
                </div>

                <div className="form-grid">
                  <input type="text" name="address" className="form-input"
                    placeholder={t("address")} onChange={handleChange} required />

                  <input type="text" name="pinCode" className="form-input"
                    placeholder={t("pin_code")} onChange={handleChange} required />

                  <input type="text" name="state" className="form-input"
                    placeholder={t("state")} onChange={handleChange} required />

                  <input type="text" name="district" className="form-input"
                    placeholder={t("district")} onChange={handleChange} required />
                </div>
              </section>


              {/* 3. PROFESSIONAL */}
              <section className="form-section" style={{ marginTop: "2rem" }}>
                <h2 className="section-title">{t("prof_title")}</h2>
                <div className="form-grid">
                  <input type="text" name="job" className="form-input"
                    placeholder={t("occupation")} onChange={handleChange} />

                  <input type="text" name="company" className="form-input"
                    placeholder={t("company")} onChange={handleChange} />
                </div>
              </section>


              {/* 4. STRESS FACTORS */}
              <section className="form-section">
                <h2 className="section-title">{t("stress_title")}</h2>

                <div className="checkbox-pills">
                  {[
                    "job_pressure",
                    "family_issues",
                    "financial",
                    "health",
                    "relationship",
                    "other"
                  ].map(key => (
                    <label key={key} className="pill-option">
                      <input type="checkbox" value={key} onChange={handleCheckboxChange} />
                      <span className="pill-label">{t(key)}</span>
                    </label>
                  ))}
                </div>
              </section>


              {/* 5. FAMILY */}
              <section className="form-section" style={{ marginTop: "2rem" }}>
                <div className="section-header">
                  <h2 className="section-title">{t("family_title")}</h2>
                </div>

                <div className="form-grid">

                  <div className="form-group">
                    <label className="form-label">{t("father")}</label>
                    <input type="text" name="father" className="form-input"
                      placeholder={t("father_name")} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("mother")}</label>
                    <input type="text" name="mother" className="form-input"
                      placeholder={t("mother_name")} onChange={handleChange} />
                  </div>


                  {formData.maritalStatus === "married" && (
                    <>
                      <div className="form-group">
                        <label className="form-label">
                          {t("spouse")} <span className="required">*</span>
                        </label>
                        <input type="text" name="spouse"
                          className="form-input"
                          placeholder={t("spouse_name")}
                          value={formData.spouse}
                          onChange={handleChange}
                          required />
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t("children")}</label>
                        <input type="text" name="children"
                          className="form-input"
                          placeholder={t("children_names")}
                          value={formData.children}
                          onChange={handleChange} />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label className="form-label">{t("grandfather")}</label>
                    <input type="text" name="grandfather" className="form-input"
                      placeholder={t("grandfather_name")} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("grandmother")}</label>
                    <input type="text" name="grandmother" className="form-input"
                      placeholder={t("grandmother_name")} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("sister")}</label>
                    <input type="text" name="sister" className="form-input"
                      placeholder={t("sister_name")} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t("brother")}</label>
                    <input type="text" name="brother" className="form-input"
                      placeholder={t("brother_name")} onChange={handleChange} />
                  </div>

                </div>
              </section>


              <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: "2rem" }}>
                {loading ? t("processing") : t("save_continue")}
              </button>

            </form>
        </div>
    );
};

export default ClientInformation;