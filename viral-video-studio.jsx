import React, { useState } from 'react';
import { Lightbulb, Zap, Image, Calendar, Download, ChevronRight, Sparkles, Video, Target, Heart, TrendingUp } from 'lucide-react';

export default function ViralVideoStudio() {
  const [stage, setStage] = useState('ideation');
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    niche: '',
    topic: '',
    targetAudience: '',
    ideas: [],
    selectedIdea: null,
    script: null,
    visuals: [],
    schedule: null
  });

  const stages = [
    { id: 'ideation', label: 'Ideation', icon: Lightbulb },
    { id: 'script', label: 'Script', icon: Zap },
    { id: 'visuals', label: 'Visuals', icon: Image },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'export', label: 'Export', icon: Download }
  ];

  const callClaude = async (prompt, systemPrompt = '') => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      return data.content.find(item => item.type === "text")?.text || "";
    } catch (error) {
      console.error("API Error:", error);
      return "Error generating content. Please try again.";
    }
  };

  const generateIdeas = async () => {
    if (!projectData.niche || !projectData.topic) {
      alert('Please fill in niche and topic');
      return;
    }

    setLoading(true);
    const prompt = `Generate 5 viral video ideas for ${projectData.niche} content about "${projectData.topic}". 
    Target audience: ${projectData.targetAudience || 'general'}
    
    For EACH idea, provide in this EXACT JSON format:
    {
      "ideas": [
        {
          "hook": "attention-grabbing first 3 seconds",
          "painPoint": "the problem this addresses",
          "solution": "the value proposition",
          "cta": "call to action",
          "viralPotential": "why this will get views (1-2 sentences)",
          "retentionStrategy": "how to keep viewers watching"
        }
      ]
    }
    
    Return ONLY valid JSON, no other text.`;

    const systemPrompt = `You are a viral content strategist. Return only valid JSON matching the exact schema requested. No markdown, no explanation, just JSON.`;
    
    const response = await callClaude(prompt, systemPrompt);
    
    try {
      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setProjectData(prev => ({ ...prev, ideas: parsed.ideas }));
      setStage('script');
    } catch (error) {
      console.error("Parse error:", error);
      alert('Error parsing ideas. Please try again.');
    }
    
    setLoading(false);
  };

  const generateScript = async (idea) => {
    setLoading(true);
    setProjectData(prev => ({ ...prev, selectedIdea: idea }));

    const prompt = `Create a complete TikTok/Short-form video script based on this idea:
    Hook: ${idea.hook}
    Pain Point: ${idea.painPoint}
    Solution: ${idea.solution}
    CTA: ${idea.cta}
    
    Niche: ${projectData.niche}
    Topic: ${projectData.topic}
    
    Return ONLY valid JSON in this format:
    {
      "script": {
        "hook": "exact hook text (0-3 sec)",
        "intro": "introduction text (3-8 sec)",
        "painTapIn": "elaborate on the pain point (8-15 sec)",
        "triggerAction": "create urgency/emotional trigger (15-20 sec)",
        "solution": "present the solution (20-35 sec)",
        "proof": "add credibility/social proof (35-45 sec)",
        "cta": "strong call to action (45-60 sec)",
        "visualCues": ["scene 1 visual description", "scene 2 visual description", "etc"],
        "soundSuggestions": "background music/sound effect suggestions",
        "textOverlays": ["key text overlay 1", "key text overlay 2"]
      }
    }
    
    No markdown, just JSON.`;

    const systemPrompt = `You are a viral video script writer. Create scripts optimized for maximum retention and virality. Return only valid JSON.`;
    
    const response = await callClaude(prompt, systemPrompt);
    
    try {
      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setProjectData(prev => ({ ...prev, script: parsed.script }));
      setStage('visuals');
    } catch (error) {
      console.error("Parse error:", error);
      alert('Error parsing script. Please try again.');
    }
    
    setLoading(false);
  };

  const generateVisuals = async () => {
    setLoading(true);

    const prompt = `Based on this video script, create detailed AI image generation prompts for each scene:
    
    Script Sections:
    - Hook: ${projectData.script.hook}
    - Intro: ${projectData.script.intro}
    - Pain Tap In: ${projectData.script.painTapIn}
    - Trigger/Action: ${projectData.script.triggerAction}
    - Solution: ${projectData.script.solution}
    - Proof: ${projectData.script.proof}
    - CTA: ${projectData.script.cta}
    
    Visual Cues: ${projectData.script.visualCues.join(', ')}
    
    Return ONLY valid JSON:
    {
      "visuals": [
        {
          "sceneNumber": 1,
          "timestamp": "0-3 sec",
          "scriptSection": "hook",
          "imagePrompt": "detailed Midjourney/DALL-E style prompt",
          "visualStyle": "cinematic/authentic/animated/etc",
          "composition": "shot composition details"
        }
      ]
    }
    
    Create 6-8 scenes covering the entire script. Each prompt should be vivid, specific, and optimized for AI image generation. No markdown.`;

    const systemPrompt = `You are a visual director creating AI image prompts. Be specific about style, lighting, composition, and mood. Return only valid JSON.`;
    
    const response = await callClaude(prompt, systemPrompt);
    
    try {
      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setProjectData(prev => ({ ...prev, visuals: parsed.visuals }));
      setStage('schedule');
    } catch (error) {
      console.error("Parse error:", error);
      alert('Error parsing visuals. Please try again.');
    }
    
    setLoading(false);
  };

  const generateSchedule = async () => {
    setLoading(true);

    const prompt = `Create an optimal posting and production schedule for this video:
    
    Topic: ${projectData.topic}
    Niche: ${projectData.niche}
    Target Audience: ${projectData.targetAudience}
    
    Return ONLY valid JSON:
    {
      "schedule": {
        "productionTimeline": {
          "scriptFinalization": "Day 1: 2 hours",
          "visualGeneration": "Day 1-2: details",
          "voiceoverRecording": "Day 2: details",
          "videoEditing": "Day 2-3: details",
          "reviewAndTweaks": "Day 3: details"
        },
        "optimalPostingTimes": [
          {"platform": "TikTok", "time": "7-9 AM or 7-11 PM EST", "reason": "peak engagement"},
          {"platform": "Instagram Reels", "time": "details", "reason": "why"}
        ],
        "contentStrategy": {
          "mainPost": "when to post the main video",
          "teasers": "teaser strategy 24h before",
          "followUps": "follow-up content ideas",
          "crossPlatform": "multi-platform distribution plan"
        },
        "engagementTactics": ["tactic 1", "tactic 2", "tactic 3"],
        "hashtagStrategy": ["#hashtag1", "#hashtag2", "etc"]
      }
    }
    
    No markdown.`;

    const systemPrompt = `You are a social media strategist specializing in viral content distribution. Return only valid JSON.`;
    
    const response = await callClaude(prompt, systemPrompt);
    
    try {
      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setProjectData(prev => ({ ...prev, schedule: parsed.schedule }));
      setStage('export');
    } catch (error) {
      console.error("Parse error:", error);
      alert('Error parsing schedule. Please try again.');
    }
    
    setLoading(false);
  };

  const exportProject = () => {
    const exportData = {
      projectName: `${projectData.niche} - ${projectData.topic}`,
      generatedAt: new Date().toISOString(),
      ...projectData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral-video-${projectData.topic.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b4e 100%)',
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: 'radial-gradient(circle at 25% 25%, #ff00ff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00ffff 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Video size={40} style={{ color: '#ff00ff' }} />
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              margin: 0,
              background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              VIRAL STUDIO
            </h1>
          </div>
          <p style={{ fontSize: '1.2rem', color: '#a0a0ff', margin: 0 }}>
            AI-Powered Video Creation Pipeline
          </p>
        </div>

        {/* Stage Progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '50px',
          padding: '0 20px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {stages.map((s, idx) => {
            const Icon = s.icon;
            const isActive = s.id === stage;
            const isPassed = stages.findIndex(st => st.id === stage) > idx;
            
            return (
              <div key={s.id} style={{ flex: 1, minWidth: '120px' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isActive || isPassed ? 1 : 0.4,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isActive 
                      ? 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)'
                      : isPassed
                      ? 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)'
                      : '#2a2a4e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isActive ? '3px solid #fff' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Icon size={28} />
                  </div>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          {/* IDEATION STAGE */}
          {stage === 'ideation' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Sparkles style={{ color: '#ff00ff' }} />
                Ideation Phase
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#00ffff' }}>
                    Content Niche
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mental Health, Fitness, Finance, Tech Reviews"
                    value={projectData.niche}
                    onChange={(e) => setProjectData(prev => ({ ...prev, niche: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#00ffff' }}>
                    Specific Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Anger Management, Morning Routines, Passive Income"
                    value={projectData.topic}
                    onChange={(e) => setProjectData(prev => ({ ...prev, topic: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#00ffff' }}>
                    Target Audience (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Young professionals 25-35, Students, Parents"
                    value={projectData.targetAudience}
                    onChange={(e) => setProjectData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <button
                  onClick={generateIdeas}
                  disabled={loading}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Generating Ideas...' : (
                    <>
                      Generate Viral Ideas
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SCRIPT STAGE */}
          {stage === 'script' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Zap style={{ color: '#ff00ff' }} />
                Choose Your Viral Idea
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {projectData.ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 0, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => !loading && generateScript(idea)}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Target size={18} style={{ color: '#ff00ff' }} />
                        <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#00ffff' }}>Idea #{idx + 1}</h3>
                      </div>
                      <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '8px 0' }}>
                        🪝 {idea.hook}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
                      <div>
                        <span style={{ color: '#ff6b9d', fontWeight: 600 }}>Pain Point:</span>
                        <p style={{ margin: '4px 0', color: '#ccc' }}>{idea.painPoint}</p>
                      </div>
                      <div>
                        <span style={{ color: '#00ffff', fontWeight: 600 }}>Solution:</span>
                        <p style={{ margin: '4px 0', color: '#ccc' }}>{idea.solution}</p>
                      </div>
                      <div>
                        <span style={{ color: '#ffaa00', fontWeight: 600 }}>CTA:</span>
                        <p style={{ margin: '4px 0', color: '#ccc' }}>{idea.cta}</p>
                      </div>
                      <div style={{ 
                        padding: '12px',
                        background: 'rgba(0, 255, 255, 0.1)',
                        borderRadius: '8px',
                        marginTop: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <TrendingUp size={16} style={{ color: '#00ffff' }} />
                          <span style={{ fontWeight: 600, color: '#00ffff' }}>Viral Potential:</span>
                        </div>
                        <p style={{ margin: '4px 0', color: '#ccc', fontSize: '0.9rem' }}>{idea.viralPotential}</p>
                      </div>
                      <div style={{ 
                        padding: '12px',
                        background: 'rgba(255, 0, 255, 0.1)',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <Heart size={16} style={{ color: '#ff00ff' }} />
                          <span style={{ fontWeight: 600, color: '#ff00ff' }}>Retention Strategy:</span>
                        </div>
                        <p style={{ margin: '4px 0', color: '#ccc', fontSize: '0.9rem' }}>{idea.retentionStrategy}</p>
                      </div>
                    </div>

                    <button
                      disabled={loading}
                      style={{
                        marginTop: '16px',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1,
                        width: '100%'
                      }}
                    >
                      {loading ? 'Creating Script...' : 'Select & Generate Script →'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISUALS STAGE */}
          {stage === 'visuals' && projectData.script && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Zap style={{ color: '#00ffff' }} />
                Your Script
              </h2>

              <div style={{
                padding: '24px',
                borderRadius: '16px',
                background: 'rgba(0, 0, 0, 0.3)',
                marginBottom: '30px'
              }}>
                {Object.entries(projectData.script).map(([key, value]) => {
                  if (key === 'visualCues' || key === 'textOverlays') {
                    return (
                      <div key={key} style={{ marginBottom: '20px' }}>
                        <h3 style={{ 
                          color: '#ff00ff',
                          textTransform: 'capitalize',
                          fontSize: '1.1rem',
                          marginBottom: '8px'
                        }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <ul style={{ color: '#ccc', paddingLeft: '20px' }}>
                          {value.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  
                  if (typeof value === 'string') {
                    return (
                      <div key={key} style={{ marginBottom: '20px' }}>
                        <h3 style={{ 
                          color: '#00ffff',
                          textTransform: 'capitalize',
                          fontSize: '1.1rem',
                          marginBottom: '8px'
                        }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p style={{ color: '#ccc', lineHeight: '1.6' }}>{value}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={generateVisuals}
                disabled={loading}
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: loading ? 0.6 : 1,
                  width: '100%'
                }}
              >
                {loading ? 'Generating Visual Prompts...' : (
                  <>
                    Generate AI Visual Prompts
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* SCHEDULE STAGE */}
          {stage === 'schedule' && projectData.visuals.length > 0 && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Image style={{ color: '#00ffff' }} />
                AI Visual Prompts
              </h2>

              <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
                {projectData.visuals.map((visual, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      background: 'rgba(0, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ color: '#00ffff', margin: 0 }}>
                        Scene {visual.sceneNumber} • {visual.timestamp}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(255, 0, 255, 0.2)',
                        fontSize: '0.85rem',
                        color: '#ff00ff'
                      }}>
                        {visual.scriptSection}
                      </span>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ 
                        color: '#fff',
                        fontWeight: 600,
                        marginBottom: '8px',
                        fontSize: '0.95rem'
                      }}>
                        📸 Image Prompt:
                      </p>
                      <p style={{ 
                        color: '#ccc',
                        lineHeight: '1.6',
                        padding: '12px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}>
                        {visual.imagePrompt}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: '#ff00ff', fontWeight: 600 }}>Style:</span>
                        <span style={{ color: '#ccc', marginLeft: '8px' }}>{visual.visualStyle}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: '#00ffff', fontWeight: 600 }}>Composition:</span>
                        <span style={{ color: '#ccc', marginLeft: '8px' }}>{visual.composition}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={generateSchedule}
                disabled={loading}
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: loading ? 0.6 : 1,
                  width: '100%'
                }}
              >
                {loading ? 'Creating Schedule...' : (
                  <>
                    Generate Posting Schedule
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* EXPORT STAGE */}
          {stage === 'export' && projectData.schedule && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Calendar style={{ color: '#00ffff' }} />
                Production & Posting Schedule
              </h2>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#ff00ff', fontSize: '1.4rem', marginBottom: '16px' }}>
                  📋 Production Timeline
                </h3>
                <div style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 0, 255, 0.1)',
                  border: '1px solid rgba(255, 0, 255, 0.3)'
                }}>
                  {Object.entries(projectData.schedule.productionTimeline).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#00ffff', fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span style={{ color: '#ccc', marginLeft: '8px' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#00ffff', fontSize: '1.4rem', marginBottom: '16px' }}>
                  ⏰ Optimal Posting Times
                </h3>
                {projectData.schedule.optimalPostingTimes.map((timing, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(0, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      marginBottom: '12px'
                    }}
                  >
                    <h4 style={{ color: '#fff', margin: '0 0 8px 0' }}>{timing.platform}</h4>
                    <p style={{ color: '#00ffff', margin: '0 0 4px 0', fontWeight: 600 }}>
                      {timing.time}
                    </p>
                    <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem' }}>{timing.reason}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#ff00ff', fontSize: '1.4rem', marginBottom: '16px' }}>
                  🎯 Content Strategy
                </h3>
                <div style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 0, 255, 0.1)',
                  border: '1px solid rgba(255, 0, 255, 0.3)'
                }}>
                  {Object.entries(projectData.schedule.contentStrategy).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#00ffff', fontWeight: 600 }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <p style={{ color: '#ccc', margin: '4px 0 0 0' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#00ffff', fontSize: '1.4rem', marginBottom: '16px' }}>
                  💡 Engagement Tactics
                </h3>
                <ul style={{ color: '#ccc', paddingLeft: '20px' }}>
                  {projectData.schedule.engagementTactics.map((tactic, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{tactic}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#ff00ff', fontSize: '1.4rem', marginBottom: '16px' }}>
                  #️⃣ Hashtag Strategy
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {projectData.schedule.hashtagStrategy.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={exportProject}
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%'
                }}
              >
                <Download size={20} />
                Export Complete Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}