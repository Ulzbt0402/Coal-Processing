const analysisTabs = [...document.querySelectorAll('#calculator-tabs [role="tab"]')];

function showAnalysisTab(name, focus = false) {
    const activeId = name + '-tab';
    for (const tab of analysisTabs) {
        const active = tab.id === activeId;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
        if (active && focus) tab.focus();
    }
}

analysisTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showAnalysisTab(tab.id.replace('-tab', '')));
    tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % analysisTabs.length;
        else if (event.key === 'ArrowLeft') next = (index + analysisTabs.length - 1) % analysisTabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = analysisTabs.length - 1;
        else return;
        event.preventDefault();
        showAnalysisTab(analysisTabs[next].id.replace('-tab', ''), true);
    });
});

document.querySelectorAll('[data-analysis-target]').forEach(button => {
    button.addEventListener('click', () => {
        showAnalysisTab(button.dataset.analysisTarget, true);
        document.getElementById('calculator-section').scrollIntoView({ block: 'start' });
    });
});

function switchPosterScenario(mode) {
    const scenarios = {
        chemical: { margin: 64, gain: '6.8x' },
        carbon: { margin: 76, gain: '18.5x' }
    };
    const scenario = scenarios[mode];
    if (!scenario) return;
    ['chemical', 'carbon'].forEach(name => {
        const button = document.getElementById('poster-mode-' + name);
        const selected = name === mode;
        button.setAttribute('aria-pressed', String(selected));
        button.classList.toggle('bg-emerald-500', selected);
        button.classList.toggle('text-coal-950', selected);
        button.classList.toggle('shadow', selected);
        button.classList.toggle('text-slate-300', !selected);
        button.classList.toggle('hover:text-white', !selected);
    });
    document.getElementById('posterRawMargin').textContent = '18%';
    document.getElementById('posterRawMarginBar').style.width = '18%';
    document.getElementById('posterProcMargin').textContent = scenario.margin + '%';
    document.getElementById('posterProcMarginBar').style.width = scenario.margin + '%';
    document.getElementById('posterMarginDiff').textContent = '+' + (scenario.margin - 18).toFixed(1) + ' хувийн пункт';
    document.getElementById('posterUnitGain').textContent = scenario.gain + ' дахин (жишиг)';
    document.getElementById('posterSummaryHighlight').textContent = scenario.margin + '% жишиг маржин';
}

function printMarginAnalysis() {
    showAnalysisTab('margin');
    document.body.classList.add('print-margin');
    window.print();
}

window.addEventListener('afterprint', () => document.body.classList.remove('print-margin'));
switchPosterScenario('chemical');
