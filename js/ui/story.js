window.IAG_UI.renderStoryScene = function(sceneId) {
    const state = window.IAG_STATE.get();
    const scene = window.IAG_STORY.getScene(sceneId);

    if (window.IAG_UI.elements.storyTitle) window.IAG_UI.elements.storyTitle.textContent = scene.title;
    if (window.IAG_UI.elements.storyText) window.IAG_UI.elements.storyText.innerHTML = scene.text;

    if (window.IAG_UI.elements.storyChoices) {
      window.IAG_UI.elements.storyChoices.innerHTML = "";
      
      // If character creation is in-progress, gate story interactions
      if (!state.characterCreationComplete) {
        const notice = document.createElement("div");
        notice.className = "gating-notice";
        notice.innerHTML = `
          <div class="gating-warning-icon">⚠</div>
          <div class="gating-text">Create and verify your character profile above to enter the story timeline.</div>
        `;
        window.IAG_UI.elements.storyChoices.appendChild(notice);
      } else {
        scene.options.forEach(option => {
          const btn = document.createElement("button");
          btn.className = "action-btn";
          
          // Evaluate requirements
          const req = window.IAG_STORY.checkRequirement(state, option.requires);
          
          if (!req.satisfied) {
            btn.classList.add("disabled");
            btn.disabled = true;
            btn.innerHTML = `<span>${option.label}</span> <span class="requirement-tag">(Locked)</span>`;
            btn.title = req.errorMsg || "Requirement not met.";
          } else {
            btn.textContent = option.label;
            btn.addEventListener("click", () => {
              window.IAG_UI.handleChoiceClick(option);
            });
          }
          window.IAG_UI.elements.storyChoices.appendChild(btn);
        });
      }
    }
  }

window.IAG_UI.handleChoiceClick = function(option) {
    window.IAG_STATE.update(state => {
      // Apply effects
      if (option.effects) {
        option.effects.forEach(eff => {
          window.IAG_STORY.applyEffect(state, eff);
        });
      }
      
      // Update scene ID
      state.sceneId = option.next;
    });
  }