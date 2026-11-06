(() => {
  "use strict";

  const CONTENT_VERSION = 16;
  const TARGET_LISTING = "MPS-46214";
  const SIMULATION_OFFER_DATE = "2026-10-16";
  const LEAD_FORM_VIEW = { x:656, y:123, width:588, height:640 };
  const LEAD_FORM_HEIGHT = 1086;
  let leadFormScrollTop = 0;
  let qualificationScrollTop = 0;
  let filterScrollTop = 0;
  let filterBedsOpen = false;
  let followupTimePickerOpen = false;
  let followupTimeDraft = { hour:14, minute:0 };
  const LEAD_SMART_LOCATIONS = [
    { label:"Imperial Avenue, Downtown Dubai, Dubai, United Arab Emirates", values:{region:"United Arab Emirates",city:"Dubai",district:"Downtown Dubai",subDistrict:"Imperial Avenue",building:"Imperial Avenue"} },
    { label:"Marina Gate 1, Marina Gate, Dubai Marina, Dubai, United Arab Emirates", values:{region:"United Arab Emirates",city:"Dubai",district:"Dubai Marina",subDistrict:"Marina Gate",building:"Marina Gate 1"} },
    { label:"Azizi Plaza, Al Furjan, Dubai, United Arab Emirates", values:{region:"United Arab Emirates",city:"Dubai",district:"Al Furjan",subDistrict:"Azizi Plaza",building:"Azizi Plaza"} }
  ];
  const LEAD_FIELDS = [
    {id:"title",label:"Title",x:0,y:28,width:100,height:47,options:["Mr","Mrs","Ms","Dr"]},
    {id:"name",label:"Name",x:112,y:28,width:476,height:47,required:true,placeholder:"Enter name"},
    {id:"mobile",label:"Mobile",x:0,y:119,width:289,height:47,required:true,placeholder:"+971 50 123 4567"},
    {id:"email",label:"Email",x:301,y:119,width:287,height:47,required:true,placeholder:"Enter email"},
    {id:"source",label:"Source",x:0,y:212,width:289,height:48,required:true,options:["Bayut.com","Dubizzle.com","Client Referral","Facebook","Instagram","Propertyfinder.ae","Company Website","Personal Client","Existing Company Client","Internal Company Referral","Referral","Direct Call"]},
    {id:"subSource",label:"Sub Source",x:301,y:212,width:287,height:48,options:["Client database","Friend","Walk-in","Other"]},
    {id:"customerType",label:"Customer Type",x:0,y:302,width:289,height:47,required:true,options:["Buyer","Tenant","Agent","Seller","Landlord"]},
    {id:"budget",label:"Budget",x:301,y:302,width:287,height:47,options:["< 1M","1M - 2M","2M - 3M","3M - 5M","5M +"]},
    {id:"languages",label:"Languages",x:0,y:391,width:588,height:48,placeholder:"Enter one or more languages"},
    {id:"smartLocation",label:"Smart Location Detection",x:0,y:583,width:588,height:48,placeholder:"Search a building, district, area...",options:LEAD_SMART_LOCATIONS.map(x=>x.label)},
    {id:"region",label:"Region / State",x:0,y:673,width:289,height:48,required:true,options:["United Arab Emirates"]},
    {id:"city",label:"City",x:301,y:673,width:287,height:48,required:true,options:["Abu Dhabi","Ajman","Al Ain","Dubai","Fujairah","Ras Al Khaimah","Sharjah"]},
    {id:"district",label:"District",x:0,y:763,width:187,height:47,options:["Business Bay","Dubai Marina","Al Furjan","Downtown Dubai","Palm Jumeirah"]},
    {id:"subDistrict",label:"Sub-district",x:200,y:763,width:188,height:47,options:["Imperial Avenue","Marina Gate","Azizi Plaza","Downtown Views II"]},
    {id:"building",label:"Building",x:401,y:763,width:187,height:47,options:["Imperial Avenue","Marina Gate 1","Marina Gate 2","Azizi Plaza"]},
    {id:"tower",label:"Tower Name",x:0,y:852,width:289,height:47,options:["Tower A","Tower B","North Tower"]},
    {id:"buildingNo",label:"Building No",x:301,y:852,width:287,height:47,options:["1","2","3"]},
    {id:"category",label:"Category",x:0,y:942,width:138,height:47,options:["Apartment","Villa","Townhouse","Penthouse","Land Residential"]},
    {id:"listingType",label:"Listing Type",x:150,y:942,width:139,height:47,options:["Sale","Rent"]},
    {id:"minBed",label:"Min Bed",x:301,y:942,width:138,height:47,options:["Studio","1","2","3","4","5+"]},
    {id:"maxBed",label:"Max Bed",x:450,y:942,width:138,height:47,options:["Studio","1","2","3","4","5+"]},
    {id:"minPrice",label:"Min Price",x:0,y:1032,width:138,height:47,type:"number",placeholder:"0"},
    {id:"maxPrice",label:"Max Price",x:150,y:1032,width:139,height:47,type:"number",placeholder:"0"},
    {id:"minArea",label:"Min Area",x:301,y:1032,width:138,height:47,type:"number",placeholder:"0"},
    {id:"maxArea",label:"Max Area",x:450,y:1032,width:138,height:47,type:"number",placeholder:"0"}
  ];
  const el = {
    app: document.querySelector("#app"), canvas: document.querySelector("#canvas"), screen: document.querySelector("#screen"),
    layer: document.querySelector("#interactionLayer"), stepLabel: document.querySelector("#stepLabel"),
    stepTitle: document.querySelector("#stepTitle"), instruction: document.querySelector("#instruction"),
    feedback: document.querySelector("#feedback"), clock: document.querySelector("#clock"),
    progressFill: document.querySelector("#progressFill"), progressText: document.querySelector("#progressText"),
    hint: document.querySelector("#hintButton"), restart: document.querySelector("#restartButton"),
    fullscreen: document.querySelector("#fullscreenButton"), caseButton: document.querySelector("#caseButton"),
    drawer: document.querySelector("#caseDrawer"), closeCase: document.querySelector("#closeCase"),
    drawerScrim: document.querySelector("#drawerScrim"), caseContent: document.querySelector("#caseContent")
  };

  const scenes = [
    { id:"intro", kind:"intro", screen:"listing-home.webp", tall:true, time:"12 October 2026 · 9:00 AM", title:"Create the seller's listing", instruction:"Review Omar's information, then create and price his listing in MCRM." },
    { id:"my-listings", kind:"hotspot", screen:"listing-home.webp", tall:true, time:"12 October 2026 · 9:02 AM", title:"Open My Listings", instruction:"Select My Listings to begin Omar's property record.", target:[15,70,262,43], label:"Open My Listings" },
    { id:"add-property", kind:"hotspot", screen:"listing-my.webp", tall:true, time:"12 October 2026 · 9:03 AM", title:"Start Omar's listing", instruction:"Select Add property.", target:[1700,123,162,44], label:"Add property" },
    { id:"listing-form", kind:"listingForm", screen:"listing-form.webp", tall:true, time:"12 October 2026 · 9:05 AM", title:"Create Omar's listing", instruction:"Use the seller and property details in the Case File to complete every required field, then select Submit." },
    { id:"edit-listing-details", kind:"hotspot", screen:"listing-price.webp", tall:true, time:"12 October 2026 · 9:18 AM", title:"Complete Listing Details", instruction:"In Listing Details, select Edit to complete the required Information fields.", target:[1392,77,48,47], label:"Edit Listing Details" },
    { id:"listing-price", kind:"listingPrice", screen:"listing-price.webp", tall:true, time:"12 October 2026 · 9:19 AM", title:"Complete the Information section", instruction:"Use the Case File to complete every required field in Information, then select Done." },
    {"id":"listing-details","kind":"listingDetailTask","screen":"listing-documents.webp","tall":true,"detail":true,"time":"12 October 2026 · 9:21 AM","title":"Complete the listing details","instruction":"Scroll down to Contact. Click its plus button, create Omar’s contact using the Case file and save. Continue down the listing to complete and save the remaining sections.","task":"journey"},
    {"id":"listing-requested","kind":"phase","screen":"listing-publish.webp","tall":true,"time":"12 October 2026 · 9:31 AM","title":"Publication requested","instruction":"Review the request outcome before continuing to the buyer enquiry.","eyebrow":"LISTING PREPARATION COMPLETE","heading":"The publication request has been submitted","body":"The request is pending review. In this case, the listing is approved before Saira’s enquiry arrives two days later.","facts":[["Owner","Omar Al Mansoori"],["Listing","MPS-46214"],["Request status","Pending review"]],"action":"Continue the client journey"},
    { id:"lead-arrival", kind:"phase", screen:"lead-new.webp", time:"14 October 2026 · 9:00 AM", title:"A Bayut lead arrives", instruction:"Review the new lead event, then begin the callback.", eyebrow:"TWO DAYS LATER", heading:"A buyer has enquired about Omar's listing", body:"MCRM has created a new lead from Bayut and tied it to Omar's listing. Saira Khan is waiting for a callback.", facts:[["Lead","Saira Khan"],["Source","Bayut.com"],["Linked listing","MPS-46214"],["Stage","New"]], action:"Start the callback" },
    { id:"call", kind:"contact", screen:"lead-new.webp", time:"14 October 2026 · 9:02 AM", title:"Make the first contact attempt", instruction:"The Bayut lead is New. Select Call to record the first required activity.", target:[438,624,81,55], label:"Select Call", contact:"call" },
    { id:"no-answer-brief", kind:"phase", screen:"lead-new.webp", time:"14 October 2026 · 9:04 AM", title:"The client did not answer", instruction:"Review the outcome, then record it in MCRM before planning the next activity.", eyebrow:"CALL OUTCOME", heading:"Saira did not answer", body:"Set the client response to No Answer, then schedule an outgoing follow-up call for today at 2:00 PM.", facts:[["Client response","No Answer"],["Follow-up","Today at 2:00 PM"],["Direction","Outgoing"]], action:"Record the outcome" },
    { id:"no-answer", kind:"contact", screen:"lead-new.webp", time:"14 October 2026 · 9:05 AM", title:"Record the unanswered call", instruction:"Saira did not answer. Select No Answer to update the lead's client response.", target:[568,720,121,47], label:"Select No Answer", contact:"noanswer" },
    { id:"followup-plus", kind:"hotspot", screen:"lead-no-answer.webp", time:"14 October 2026 · 9:06 AM", title:"Plan the next activity", instruction:"In Follow-ups, select the plus button.", target:[1400,548,53,62], label:"Add a follow-up" },
    { id:"followup-type", kind:"followupMenu", screen:"lead-no-answer.webp", time:"14 October 2026 · 9:07 AM", title:"Choose the follow-up type", instruction:"Select Call from the follow-up menu." },
    { id:"followup-form", kind:"followupForm", screen:"followup-form.webp", time:"14 October 2026 · 9:08 AM", title:"Schedule the outgoing call", instruction:"Select Today (14 October 2026) and schedule an outgoing follow-up call for 2:00 PM. A note and priority are optional." },
    { id:"complete-followup", kind:"completeFollowup", screen:"followup-due.webp", time:"14 October 2026 · 2:00 PM", title:"Complete the scheduled follow-up", instruction:"The follow-up is now due. Hover over the follow-up, then select its check icon after completing the call.", label:"Complete follow-up" },
    { id:"qualification-brief", kind:"phase", screen:"qualify-initial.webp", time:"14 October 2026 · 2:03 PM", title:"The follow-up is successful", instruction:"Review what Saira tells you, then update and qualify her lead.", eyebrow:"FOLLOW-UP CONVERSATION", heading:"Saira answers and confirms her requirements", body:"She is interested and provides the information needed to qualify the lead. These details are now available in the Case File.", facts:[["Budget","AED 3M–5M"],["Bedrooms","2–3"],["Timeline","2 months"],["Level of interest","Warm"],["Client response","Contacted"]], action:"Update the lead" },
    { id:"navigate-qualify", kind:"hotspot", screen:"lead-listings.webp", tall:true, time:"14 October 2026 · 2:04 PM", title:"Return to Saira's lead", instruction:"Select My leads from the left menu.", target:[15,110,262,44], label:"Open My leads" },
    { id:"open-qualify-lead", kind:"leadTarget", screen:"options-leads.webp", time:"14 October 2026 · 2:05 PM", title:"Open the Bayut lead", instruction:"Select Saira Khan's highlighted lead." },
    { id:"contacted", kind:"hotspot", screen:"qualify-initial.webp", time:"14 October 2026 · 2:06 PM", title:"Record the successful contact", instruction:"Saira answered the follow-up call. Select Contacted.", target:[442,718,120,49], label:"Select Contacted" },
    { id:"qualify", kind:"qualifyJourney", screen:"options-leads.webp", time:"14 October 2026 · 2:07 PM", title:"Qualify Saira", instruction:"Scroll through the lead, open Qualify, and record the Budget, Timeline and Level of Interest from the Case File." },
    { id:"open-listings", kind:"hotspot", screen:"options-leads.webp", time:"14 October 2026 · 2:12 PM", title:"Search for a suitable option", instruction:"Select All Listings from the left menu.", target:[12,101,270,53], label:"All Listings" },
    { id:"open-filters", kind:"hotspot", screen:"options-listings.webp", time:"14 October 2026 · 2:13 PM", title:"Open listing filters", instruction:"Select All Filters.", target:[1705,211,142,55], label:"All Filters" },
    { id:"filters", kind:"filters", screen:"options-filters.webp", time:"14 October 2026 · 2:14 PM", title:"Search using Saira's criteria", instruction:"Enter the key criteria from the Case File. You may add any other filters you consider useful." },
    {"id":"open-matching-listing","kind":"hotspot","screen":"options-results.webp","time":"14 October 2026 · 2:16 PM","title":"Open the matching listing","instruction":"Select the title of the top matching listing to open it. The number on the All Listings page cannot be copied.","target":[499,632,365,33],"label":"Open listing MPS-46214"},
    {"id":"copy-listing","kind":"copy","screen":"options-listing-open.webp","time":"14 October 2026 · 2:16 PM","title":"Copy the listing number","instruction":"Select MPS-46214 at the top of the open listing, then copy it with Ctrl+C or right-click and choose Copy."},
    {"id":"close-matching-listing","kind":"hotspot","screen":"options-listing-open.webp","time":"14 October 2026 · 2:17 PM","title":"Close the listing","instruction":"The listing number is copied. Select the X at the top right to close the listing.","target":[1732,35,48,48],"label":"Close listing details"},
    { id:"return-leads", kind:"hotspot", screen:"options-results.webp", time:"14 October 2026 · 2:17 PM", title:"Return to the lead", instruction:"Select My Leads from the left menu.", target:[13,184,270,55], label:"My Leads" },
    { id:"open-lead", kind:"leadTarget", screen:"options-leads.webp", time:"14 October 2026 · 2:18 PM", title:"Open Saira's qualified lead", instruction:"Select the highlighted Saira Khan lead." },
    { id:"open-options", kind:"hotspot", screen:"options-lead.webp", time:"14 October 2026 · 2:19 PM", title:"Add an option", instruction:"In Options Sent, select the plus button.", target:[1090,606,66,66], label:"Add Option Sent" },
    { id:"add-option", kind:"optionModal", screen:"options-lead.webp", time:"14 October 2026 · 2:20 PM", title:"Add the matching listing", instruction:"Paste the copied listing number, select the result, then submit it to Options Sent." },
    { id:"add-viewing", kind:"hotspot", screen:"viewing-list.png", time:"14 October 2026 · 2:25 PM", title:"Arrange the confirmed viewing", instruction:"Saira and Omar agree on tomorrow at 4:00 PM. In Viewings, select the plus button.", target:[1105,633,34,34], label:"Add viewing" },
    { id:"viewing-form", kind:"viewingForm", screen:"viewing-modal.png", time:"14 October 2026 · 2:26 PM", title:"Record the viewing", instruction:"Enter the viewing details in any order. Choose 15 October at 4:00 PM, select Viewing, choose MPS-46214 from Suggested from Option Sent, then save. The end time defaults to one hour later and remains editable." },
    {"id":"feedback-brief","kind":"phase","screen":"viewing-feedback-list.png","time":"16 October 2026 · 9:00 AM","title":"Record feedback before the offer","instruction":"Review Saira's comments, then record the viewing feedback.","eyebrow":"THE MORNING AFTER THE VIEWING","heading":"Saira shares her impressions","body":"Saira liked the unit's layout, natural light and overall condition. She felt it could suit her needs, but would prefer a similar unit on a lower floor. She remains interested and would like to discuss making an offer. Record her feedback within one day of the viewing, before proceeding to the offer.","facts":[["Viewing","15 October 2026 · 4:00 PM"],["Listing","MPS-46214"],["Preference","A lower floor"]],"action":"Record viewing feedback"},
    { id:"open-viewing-feedback", kind:"feedbackTarget", screen:"viewing-feedback-list.png", time:"16 October 2026 · 9:04 AM", title:"Open the viewing feedback form", instruction:"In the Viewings section, select Feedback for Saira's completed viewing." },
    { id:"viewing-feedback", kind:"feedbackForm", screen:"viewing-feedback-modal.png", time:"16 October 2026 · 9:05 AM", title:"Submit Saira's viewing feedback", instruction:"Record Saira's viewing feedback, then select Submit." },
    { id:"add-offer", kind:"hotspot", screen:"offer-list.png", time:"16 October 2026 · 10:00 AM", title:"Record Saira's offer", instruction:"After the viewing, Saira offers AED 4,000,000. In Offers, select the plus button.", target:[1105,581,34,38], label:"Add offer" },
    { id:"offer-form", kind:"offerForm", screen:"offer-modal.png", time:"16 October 2026 · 10:02 AM", title:"Save the offer", instruction:"Select the MPS-46214 viewing to autofill the listing details and AED 4,200,000 asking price. The date is prefilled as 16 October 2026 (today in the simulation). Change the offer price to AED 4,000,000, then save." },
    { id:"complete", kind:"complete", screen:"offer-complete.png", time:"16 October 2026 · 10:04 AM", title:"Assessment complete", instruction:"You completed the MCRM client journey from seller listing through buyer offer." }
  ];

  function initialState() {
    return {
      version: CONTENT_VERSION, scene: 0, tourStep: 1, hint: false, completed: false, copied: "", optionSelected: false, qualifyEditing: false,
      listingDetails: {owner:"",contact:{title:"",name:"",phone:"",email:""},contactCreated:false,contactOpen:false,scrollTop:0,editing:"",documents:{},amenities:[],view:"",title:"",description:"",media:{},requested:false},
      listing: { offeringType:"Sale", propertyCategory:"Residential", smartLocation:"", region:"", location:"", sublocation:"", building:"", bedrooms:"", category:"", unit:"", listingType:"", bua:"", plotArea:"", baths:"", floor:"", furnishing:"", parking:"", price:"", originalPrice:"", listingSource:"", propertyStatus:"", serviceCharge:"", streetNo:"" },
      lead: { title:"", name:"", mobile:"", email:"", source:"", customerType:"", budget:"", smartLocation:"", region:"", city:"", district:"", subDistrict:"", building:"", listingType:"", minBed:"", maxBed:"", maxPrice:"" },
      followup: { title:"", priority:"Normal", direction:"", date:"", time:"", note:"" },
      qualify: { budget:"", timeline:"", interest:"", finance:"", nationality:"", languages:"", response:"" },
      filters: { category:"", photos:"", propertyFor:"", smartLocation:"", region:"", city:"", district:"", subDistrict:"", building:"", tower:"", buildingNo:"", listingSource:"", exclusive:"", owner:"", listingType:"", ref:"", unit:"", furnishing:"", bedrooms:[], baths:"", minArea:"", maxArea:"", minPrice:"", maxPrice:"", portals:"", status:"", propertyCategory:"", marketedAgent:"", assignTo:"", company:"" },
      viewing: { date:"", time:"", endTime:"", type:"", search:"", listing:"" },
      viewingFeedback: { community:0, location:0, floor:0, view:0, floorPlan:0, builtArea:0, condition:0, notes:"", completed:false },
      offer: { viewing:"", date:SIMULATION_OFFER_DATE, price:"", region:"", city:"", district:"", subDistrict:"", building:"", buildingNo:"", tower:"", category:"", listingType:"", bedrooms:"", bathrooms:"", unit:"" }
    };
  }

  const scorm = (() => {
    let api = null, version = null, initialized = false;
    function find(name) { let w=window, n=0; while(w && n<12){ try{ if(w[name]) return w[name]; if(w.parent===w) break; w=w.parent; }catch(_){ break; } n++; } try{ return window.opener?.[name] || null; }catch(_){ return null; } }
    function init(){ api=find("API_1484_11"); version=api?"2004":null; if(!api){api=find("API");version=api?"1.2":null;} if(!api)return false; try{initialized=version==="2004"?api.Initialize("")==="true":api.LMSInitialize("")==="true";}catch(_){initialized=false;} if(initialized){set(version==="2004"?"cmi.completion_status":"cmi.core.lesson_status","incomplete");commit();} return initialized; }
    function get(k){if(!initialized)return"";try{return version==="2004"?api.GetValue(k):api.LMSGetValue(k);}catch(_){return"";}}
    function set(k,v){if(!initialized)return false;try{return(version==="2004"?api.SetValue(k,String(v)):api.LMSSetValue(k,String(v)))==="true";}catch(_){return false;}}
    function commit(){if(!initialized)return false;try{return(version==="2004"?api.Commit(""):api.LMSCommit(""))==="true";}catch(_){return false;}}
    function save(data){const raw=JSON.stringify(data);set(version==="2004"?"cmi.suspend_data":"cmi.suspend_data",raw);set(version==="2004"?"cmi.location":"cmi.core.lesson_location",String(data.scene));commit();}
    function restore(){const raw=get("cmi.suspend_data");if(!raw)return null;try{return JSON.parse(raw);}catch(_){return null;}}
    function complete(){if(version==="2004"){set("cmi.completion_status","completed");set("cmi.success_status","passed");set("cmi.score.raw","100");set("cmi.score.min","0");set("cmi.score.max","100");}else{set("cmi.core.lesson_status","passed");set("cmi.core.score.raw","100");set("cmi.core.score.min","0");set("cmi.core.score.max","100");}commit();}
    function finish(){if(!initialized)return;try{version==="2004"?api.Terminate(""):api.LMSFinish("");}catch(_){} }
    return {init,get,set,save,restore,complete,finish};
  })();

  scorm.init();
  let state = (() => {
    const restored = scorm.restore();
    if (restored?.version === CONTENT_VERSION) return restored;
    try { const local=JSON.parse(localStorage.getItem("mcrm-final-assessment")||"null"); if(local?.version===CONTENT_VERSION)return local; } catch(_){}
    return initialState();
  })();
  let feedbackText = "";

  const pct = (n,total) => `${(n/total)*100}%`;
  function position(node, rect, h=780){ node.style.left=pct(rect[0],1920); node.style.top=pct(rect[1],h); node.style.width=pct(rect[2],1920); node.style.height=pct(rect[3],h); }
  function persist(){ scorm.save(state); try{localStorage.setItem("mcrm-final-assessment",JSON.stringify(state));}catch(_){} }
  function setFeedback(message, good=false){ feedbackText=message||""; el.feedback.textContent=feedbackText; el.feedback.classList.toggle("good",good); }
  function next(){ if(state.scene<scenes.length-1) state.scene++; state.hint=false; feedbackText=""; persist(); render(); }
  function makeHotspot(scene){ const b=document.createElement("button"); b.type="button"; b.className=`hotspot${state.hint?" hint-active":""}`; b.setAttribute("aria-label",scene.label); b.title=scene.label; position(b,scene.target,scene.tall?830:780); b.addEventListener("click",next); el.layer.append(b); }
  function addControl(tag,id,rect,value,options=[],h=780){ const n=document.createElement(tag); n.id=id; n.className="form-control"; position(n,rect,h); if(tag==="select"){ const blank=document.createElement("option");blank.value="";blank.textContent="Choose an option...";n.append(blank); for(const item of options){const o=document.createElement("option");o.value=item;o.textContent=item;n.append(o);} } n.value=value||""; el.layer.append(n); return n; }
  function invalid(node,yes){ node?.classList.toggle("invalid",Boolean(yes)); }

  function renderIntro(){
    if(state.tourStep>0){renderInterfaceTour();return;}
    const overlay=document.createElement("div");overlay.className="intro-overlay";
    const card=document.createElement("section");card.className="overlay-card";
    card.innerHTML=`<p class="eyebrow">12 OCTOBER 2026 · 9:00 AM</p><h2>Omar wants to list his property</h2><p>Create the seller's listing and complete its Information section. These details are saved in the Case File for later reference.</p><div class="case-grid"><div><small>Seller</small><strong>Omar Al Mansoori</strong></div><div><small>Property for</small><strong>Sale · Residential</strong></div><div><small>Location</small><strong>Imperial Avenue, Downtown Dubai</strong></div><div><small>Unit</small><strong>712</strong></div><div><small>Category</small><strong>Apartment · 2 bedrooms</strong></div><div><small>BUA</small><strong>1,250 sq ft</strong></div><div><small>Bathrooms</small><strong>3</strong></div><div><small>Furnishing</small><strong>Unfurnished</strong></div><div><small>Listing type</small><strong>Live</strong></div><div><small>Listing source</small><strong>Internal Listing</strong></div><div><small>Property status</small><strong>Completed Secondary</strong></div><div><small>Price / Original price</small><strong>AED 4,200,000</strong></div></div><div class="policy-note"><strong>Your task:</strong> create the listing, then complete every mandatory field in Listing Details. Use the Case File whenever you need to check a value.</div>`;
    const start=document.createElement("button");start.type="button";start.className="primary";start.textContent="Begin assessment";start.addEventListener("click",next);card.append(start);overlay.append(card);el.layer.append(overlay);
  }

  function renderInterfaceTour(){
    el.hint.hidden=false;
    const steps=[
      {target:el.clock.closest(".coach-count"),title:"Simulation date and time",body:"This is the assessment timeline. When a form says Today or Tomorrow, use this date—not your computer's current date."},
      {target:document.querySelector(".coach-copy"),title:"Current task",body:"The task title and instruction tell you exactly what to complete next in MCRM."},
      {target:el.hint,title:"Hint button",body:"If you cannot find the next control, select Show hint to highlight the required target."},
      {target:el.caseButton,title:"Case file",body:"Open the Case file whenever you need to check the seller, property, lead or appointment details."},
      {target:el.fullscreen,title:"Fullscreen",body:"Use Fullscreen for more workspace. Your assessment progress and Case file remain available."}
    ];
    const index=Math.min(Math.max(state.tourStep-1,0),steps.length-1),step=steps[index];step.target?.classList.add("tour-highlight");
    const overlay=document.createElement("div");overlay.className="interface-tour";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label",`Interface tour: ${step.title}`);
    const card=document.createElement("section");card.className="interface-tour-card";card.innerHTML=`<p class="eyebrow">QUICK TOUR · ${index+1} OF ${steps.length}</p><h2>${step.title}</h2><p>${step.body}</p>`;
    const actions=document.createElement("div");actions.className="interface-tour-actions";
    if(index>0){const back=document.createElement("button");back.type="button";back.className="tour-back";back.textContent="Back";back.addEventListener("click",()=>{state.tourStep=index;persist();render();});actions.append(back);}
    const forward=document.createElement("button");forward.type="button";forward.className="tour-next";forward.textContent=index===steps.length-1?"Continue to Omar's profile":"Next";forward.addEventListener("click",()=>{if(index===steps.length-1){state.tourStep=0;persist();render();}else{state.tourStep=index+2;persist();render();}});
    actions.append(forward);card.append(actions);overlay.append(card);document.body.append(overlay);
  }

  function renderPhase(scene){
    const overlay=document.createElement("div");overlay.className="phase-overlay";
    const card=document.createElement("section");card.className="overlay-card phase-card";
    card.innerHTML=`<p class="phase-date">${scene.time}</p><p class="eyebrow">${scene.eyebrow}</p><h2>${scene.heading}</h2><p>${scene.body}</p><div class="case-grid">${scene.facts.map(([label,value])=>`<div><small>${label}</small><strong>${value}</strong></div>`).join("")}</div>`;
    const action=document.createElement("button");action.type="button";action.className="primary";action.textContent=scene.action;action.addEventListener("click",next);card.append(action);overlay.append(card);el.layer.append(overlay);
  }

  function renderLeadContextPatches(){
    const identity=document.createElement("div");identity.className="lead-identity-patch";position(identity,[454,177,480,103]);identity.innerHTML=`<strong>Saira Khan</strong><span>Personal phone&nbsp;&nbsp; +971 50 555 0147</span><span>Personal email&nbsp;&nbsp; saira.khan@example.test</span>`;el.layer.append(identity);
    const source=document.createElement("div");source.className="lead-source-patch";position(source,[1280,187,170,38]);source.textContent="Bayut.com";el.layer.append(source);
    const listing=document.createElement("div");listing.className="lead-listing-patch";position(listing,[467,345,667,55]);listing.innerHTML=`<strong>${TARGET_LISTING}</strong><span>Unit 712 · Imperial Avenue · Downtown Dubai</span>`;el.layer.append(listing);
    const preference=document.createElement("div");preference.className="lead-preference-patch";position(preference,[467,492,667,70]);preference.textContent="Not captured yet";el.layer.append(preference);
  }

  function renderListingForm(){
    const l=state.listing, h=830;
    const choice=(label,key,val,rect)=>{const b=document.createElement("button");b.type="button";b.className=`choice${l[key]===val?" selected":""}${state.hint&&!l[key]?" hint-active":""}`;b.textContent=label;position(b,rect,h);b.addEventListener("click",()=>{l[key]=val;persist();render();});el.layer.append(b);};
    choice("Sale","offeringType","Sale",[426,170,72,73]);choice("Rent","offeringType","Rent",[506,170,72,73]);choice("Residential","propertyCategory","Residential",[1294,170,96,73]);choice("Commercial","propertyCategory","Commercial",[1398,170,96,73]);
    const defs=[
      ["smartLocation",[426,279,276,47],["Imperial Avenue, Downtown Dubai, Dubai, United Arab Emirates","Marina Gate 1, Dubai Marina, Dubai, United Arab Emirates"]],
      ["region",[426,364,349,48],["Dubai","Abu Dhabi"]],["location",[785,364,350,48],["Downtown Dubai","Dubai Marina","Business Bay"]],
      ["sublocation",[1144,364,350,48],["Imperial Avenue","Downtown Views II","Marina Gate"]],["building",[426,450,526,48],["Imperial Avenue","Downtown Views II Tower 2","Marina Gate 1"]],
      ["bedrooms",[968,536,526,48],["Studio","1","2","3","4","5"]],["category",[426,622,349,48],["Apartment","Villa","Townhouse","Penthouse"]],
      ["unit",[785,622,350,48],null],["listingType",[426,707,526,48],["Live","Pocket","Verified (MCRE)","Developer"]]
    ];
    const nodes={};
    for(const [id,rect,opts] of defs){const n=addControl(opts?"select":"input",`listing-${id}`,rect,l[id],opts||[],h);n.setAttribute("aria-label",id);const sync=()=>{l[id]=n.value;if(id==="smartLocation"&&n.value){l.region="Dubai";l.location="Downtown Dubai";l.sublocation="Imperial Avenue";l.building="Imperial Avenue";}persist();if(opts)render();};n.addEventListener(opts?"change":"input",sync);nodes[id]=n;}
    const required=["offeringType","propertyCategory","region","location","sublocation","building","bedrooms","category","unit","listingType"];
    if(state.hint){for(const id of required)if(!l[id]){ if(nodes[id])nodes[id].classList.add("hint-active");break;}}
    const submit=document.createElement("button");submit.type="button";submit.className=`native-button${state.hint&&required.every(k=>l[k])?" hint-active":""}`;submit.textContent="Submit";position(submit,[1399,776,95,49],h);submit.addEventListener("click",()=>{const missing=required.filter(k=>!String(l[k]||"").trim());if(missing.length){state.hint=true;setFeedback("Complete every required listing field before submitting.");render();return;}if(l.offeringType!=="Sale"||l.propertyCategory!=="Residential"||l.location!=="Downtown Dubai"||l.building!=="Imperial Avenue"||l.bedrooms!=="2"||l.category!=="Apartment"||l.unit!=="712"||l.listingType!=="Live"){setFeedback("Check the property details against Omar's Case File.");state.hint=true;render();return;}next();});el.layer.append(submit);
  }

  function renderListingPrice(){
    const l=state.listing, h=830;
    const defs=[
      ["unit","input",[379,263,251,48],[],"Unit / Plot No"],
      ["bua","input",[647,263,253,48],[],"BUA in square feet"],
      ["plotArea","input",[915,263,253,48],[],"Plot Area in square feet"],
      ["bedrooms","select",[379,363,342,48],["Studio","1","2","3","4","5+"],"Bedrooms"],
      ["baths","select",[737,363,342,48],["1","2","3","4","5","6+"],"Baths"],
      ["floor","select",[1094,363,342,48],["Ground","1","2","3","4","5","6","7","8","9","10+"],"Floor"],
      ["furnishing","select",[379,464,251,48],["Unfurnished","Furnished","Partly Furnished"],"Furnishing"],
      ["parking","select",[647,464,253,48],["0","1","2","3+"],"Parking"],
      ["price","input",[379,563,342,48],[],"Price in AED"],
      ["originalPrice","input",[737,563,342,48],[],"Original Price in AED"],
      ["listingSource","select",[1094,563,342,48],["Internal Listing","External Listing","Developer","Owner"],"Listing Source"],
      ["propertyStatus","select",[379,664,342,48],["Completed Secondary","Ready","Off Plan","Under Construction"],"Property Status"],
      ["serviceCharge","input",[379,763,516,48],[],"Service Charge per square foot"],
      ["streetNo","input",[921,763,515,48],[],"Street Number"]
    ];
    const nodes={};
    for(const [id,tag,rect,options,label] of defs){const n=addControl(tag,id===`price`?"listing-price-input":`listing-info-${id}`,rect,l[id],options,h);n.setAttribute("aria-label",label);if(tag==="input"){n.inputMode=["unit","bua","plotArea","price","originalPrice","serviceCharge"].includes(id)?"numeric":"text";n.placeholder=["price","originalPrice"].includes(id)?"0":"";}n.addEventListener(tag==="select"?"change":"input",()=>{l[id]=n.value;n.classList.remove("invalid","hint-active");persist();});nodes[id]=n;}
    const done=document.createElement("button");done.type="button";done.className=`listing-price-done${state.hint?" hint-active":""}`;done.textContent="Done";done.setAttribute("aria-label","Save Listing Details");position(done,[1368,77,72,47],h);
    done.addEventListener("click",()=>{for(const [id,,] of defs)l[id]=nodes[id].value;const required=["unit","bua","bedrooms","baths","furnishing","price","originalPrice","listingSource","propertyStatus"];const number=v=>Number(String(v||"").replace(/\D/g,""));const expected={unit:"712",bua:1250,bedrooms:"2",baths:"3",furnishing:"Unfurnished",price:4200000,originalPrice:4200000,listingSource:"Internal Listing",propertyStatus:"Completed Secondary"};const firstWrong=required.find(id=>!String(l[id]||"").trim()||(id==="bua"||id==="price"||id==="originalPrice"?number(l[id])!==expected[id]:String(l[id]).trim()!==expected[id]));if(firstWrong){state.hint=true;nodes[firstWrong].classList.add("invalid","hint-active");setFeedback("Complete every mandatory Information field using Omar's Case File.");persist();return;}setFeedback("Listing Details saved.",true);next();});
    el.layer.append(done);
    if(state.hint){const required=["unit","bua","bedrooms","baths","furnishing","price","originalPrice","listingSource","propertyStatus"];const first=required.find(id=>!String(l[id]||"").trim());if(first)nodes[first].classList.add("hint-active");}
  }

  const LISTING_AMENITIES=["Balcony","Built in wardrobes","Central A/C","Security","Shared pool"];
  function renderListingSidebar(){}
  function renderListingDetail(){
    const d=state.listingDetails;
    if(d.mediaSaved){d.gallerySaved??=true;d.floorPlansSaved??=true;}
    if(d.editing==="media")d.editing="gallery";
    d.contact=d.contact||{title:"",name:"",phone:"",email:""};
    const frame=document.createElement("div");frame.className="lj-native";el.layer.append(frame);
    const scroller=document.createElement("div");scroller.className="lj-scroll";scroller.setAttribute("aria-label","Scrollable listing details");scroller.tabIndex=0;
    const content=document.createElement("div");content.className="lj-content";scroller.append(content);frame.append(scroller);
    const place=(node,rect,height)=>{node.style.left=pct(rect[0],1098);node.style.top=pct(rect[1],height);node.style.width=pct(rect[2],1098);node.style.height=pct(rect[3],height);};
    const control=(tag,label,rect,height,parent)=>{const n=document.createElement(tag);n.className="lj-control";n.setAttribute("aria-label",label);place(n,rect,height);parent.append(n);return n;};
    const action=(parent,label,rect,h,handler,text="",cls="")=>{const b=control("button",label,rect,h,parent);b.type="button";b.classList.add("lj-button");if(cls)b.classList.add(cls);b.textContent=text;b.addEventListener("click",handler);return b;};
    const section=(key,image,h)=>{const node=document.createElement("section");node.className="lj-section";node.dataset.section=key;node.setAttribute("aria-label",key);node.style.aspectRatio=`1098 / ${h}`;const img=document.createElement("img");img.src=`assets/images/${image}.webp`;img.alt="";node.append(img);content.append(node);return node;};
    const rememberScroll=()=>{d.scrollTop=Math.round(scroller.scrollTop/(content.clientWidth/1098));};
    scroller.addEventListener("scroll",()=>{rememberScroll();persist();},{passive:true});
    const redraw=()=>{rememberScroll();persist();render();};
    const pencil=(node,key,h,y=15,label=key)=>{
      const editing=d.editing===key;
      action(node,editing?`Save ${label}`:`Edit ${label}`,editing?[909,y,122,41]:[1038,y,43,41],h,()=>{
        if(!editing){d.editing=key;setFeedback("");redraw();return;}
        let message="";
        if(key==="documents"&&(d.documents.deed!=="Omar-title-deed.pdf"||d.documents.id!=="Omar-owner-ID.pdf"))message="Attach Omar's title deed and owner ID to their matching sections.";
        if(key==="amenities"&&!(d.amenities.length===5&&LISTING_AMENITIES.every(x=>d.amenities.includes(x))))message="Select exactly the five amenities in the Case file.";
        if(key==="views"&&d.view!=="Burj Khalifa")message="Select the view specified in the Case file.";
        if(key==="description"&&(!String(d.title||"").trim()||!String(d.description||"").trim()))message="Enter a title and a description, then save.";
        if(key==="gallery"&&d.media.photos!=="Unit-712-photo-set (3 JPG files)")message="Add the practice photo set in Gallery before saving Gallery.";
        if(key==="floorPlans"&&d.media.plan!=="Unit-712-floor-plan.png")message="Add the floor plan before saving Floor plans.";
        if(message){setFeedback(message);return;}
        d[key+"Saved"]=true;if(key==="gallery"||key==="floorPlans")d.mediaSaved=Boolean(d.gallerySaved&&d.floorPlansSaved);d.editing="";redraw();
      },editing?"Save to draft":"",editing?"lj-save":"lj-pencil");
      if(editing)action(node,`Cancel ${label} editing`,[1038,y,43,41],h,()=>{d.editing="";redraw();},"×","lj-close");
    };
    // Native Listing Details / Information, followed by the Contact block as the learner scrolls.
    const group=document.createElement("div");group.className="lj-listing-group";content.append(group);
    const listingHead=document.createElement("header");listingHead.className="lj-listing-head";const listingLabel=document.createElement("strong");listingLabel.textContent="Listing Details";listingHead.append(listingLabel);group.append(listingHead);
    const information=section("information","journey-information",696);group.append(information);
    const info=[['unit',[21,129,251,48]],['bua',[289,129,253,48]],['bedrooms',[21,229,342,48]],['baths',[379,229,342,48]],['furnishing',[21,330,251,48]],['price',[21,429,342,48]],['originalPrice',[379,429,342,48]],['listingSource',[736,429,342,48]],['propertyStatus',[21,530,342,48]]];
    for(const [key,rect] of info){const n=control("input",`Saved ${key}`,rect,696,information);n.value=state.listing[key]||"";n.readOnly=true;n.tabIndex=-1;n.classList.add("lj-readonly");}
    const owner=section("owner","journey-contact",399);
    group.append(owner);
    const plus=action(owner,"Add new owner contact",[501,14,28,28],399,()=>{d.contactOpen=true;redraw();},"+","lj-plus");
    if(!d.owner&&state.hint)plus.classList.add("hint-active");
    const select=control("input","Owner contact",[15,52,512,32],399,owner);select.value=d.owner||"Select client";select.readOnly=true;
    if(d.owner){select.classList.add("lj-linked");}
    const ownerDone=document.createElement("button");ownerDone.type="button";ownerDone.textContent=d.ownerSaved?"Saved":"Save to draft";ownerDone.setAttribute("aria-label","Save owner contact to listing");ownerDone.addEventListener("click",()=>{if(!d.owner){setFeedback("Scroll down to Contact and use the plus button to create Omar's contact first.");return;}d.ownerSaved=true;redraw();});listingHead.append(ownerDone);
    const docs=section("documents","journey-documents",372);pencil(docs,"documents",372,9);
    const attach=(node,key,rect,h,map,filename,label)=>{
      const b=action(node,`Attach ${label}`,rect,h,()=>{if(d.editing!==key){setFeedback(`Select the edit pencil in ${key==="gallery"?"Gallery":key==="floorPlans"?"Floor plans":"Documents"} first.`);return;}showFiles(map,filename,label);},map[filename]?"✓ "+map[filename]:"","lj-upload");
      if(d.editing===key)b.classList.add("lj-upload-active");
    };
    attach(docs,"documents",[375,73,346,123],372,d.documents,"deed","Title Deed / SPA");
    attach(docs,"documents",[16,212,346,122],372,d.documents,"id","Owner ID / Passport");
    const amenities=section("amenities","journey-amenities",744);pencil(amenities,"amenities",744,15);
    const upper=[['Available Networked','Balcony','Basement parking'],['BBQ area','Built in wardrobes','Cable-ready'],['Carpets','Central A/C',"Children's Pool"],['Concierge Service','Conference room','Covered parking'],['Dining in building',"Driver’s Room",'Gymnasium']];
    const lower=[['Lobby in Building',"Maid's room",'Main Service'],['Marble floors','Pets Allowed','Private Garden'],['Private Gym','Private Jacuzzi','Private Pool'],['Private garage','Sauna','Sea/Water View'],['Security','Shared Gym','Shared pool'],['Solid wood floors','Spa','Steam room'],['Study','Upgraded interior','View of Landmark'],['View of Water','Walk-in Closet']];
    const check=(parent,label,x,y,h,key)=>{const n=control("input",label,[x,y,19,19],h,parent);n.type="checkbox";n.classList.add("lj-check");n.checked=key==="amenities"?d.amenities.includes(label):d.view===label;n.disabled=d.editing!==key;n.addEventListener("change",()=>{if(key==="amenities"){d.amenities=d.amenities.filter(x=>x!==label);if(n.checked)d.amenities.push(label);}else{d.view=n.checked?label:"";parent.querySelectorAll("input").forEach(other=>{if(other!==n)other.checked=false;});}setFeedback("");persist();});};
    upper.forEach((row,r)=>row.forEach((name,c)=>check(amenities,name,[25,381,738][c],110+48*r,744,"amenities")));
    lower.forEach((row,r)=>row.forEach((name,c)=>check(amenities,name,[25,381,738][c],339+48*r,744,"amenities")));
    const views=section("views","journey-views",562);pencil(views,"views",562,15);
    const viewRows=[['Atlantis','Back to Back','Burj Khalifa'],['Canal','Community','Fountains'],['Golf Course','Internal Road','Lake'],['Marina','Park','Power Lines'],['Road','Sea','Sheikh Zayed Road'],['Single Row','Swimming Pool','Vacant Land'],['Palm View','Ain Dubai View','skyline View'],['Lagoon','Al Marjan','Casino'],['Golf','Mangrove','Island']];
    viewRows.forEach((row,r)=>row.forEach((name,c)=>check(views,name,[25,381,738][c],109+48*r,562,"views")));
    const description=section("description","journey-description",577);pencil(description,"description",577,13);
    const title=control("input","Listing title",[21,113,1056,48],577,description);title.value=d.title;title.disabled=d.editing!=="description";
    const counter=control("span","Title characters",[1000,164,77,19],577,description);counter.classList.add("lj-counter");counter.textContent=`${d.title.length} characters`;
    const copy=control("textarea","English listing description",[21,279,1056,297],577,description);copy.value=d.description;copy.disabled=d.editing!=="description";
    title.addEventListener("input",()=>{d.title=title.value;counter.textContent=`${d.title.length} characters`;setFeedback("");persist();});copy.addEventListener("input",()=>{d.description=copy.value;setFeedback("");persist();});
    action(description,"Autofill listing description",[820,14,90,42],577,()=>{if(d.editing!=="description"){setFeedback("Select the edit pencil in Title & Description first.");return;}if(d.description.trim()&&!window.confirm("Replace the current description with the template?"))return;d.description="Metropolitan presents a [bedrooms]-bedroom apartment in [building], [district]. The property has [bathrooms] bathrooms and a built-up area of [area] sq ft. It is [furnishing], with a [view] view. Asking price: AED [price].";copy.value=d.description;persist();},"Autofill","lj-autofill");
    const media=section("media","journey-gallery",534);
    pencil(media,"gallery",534,14,"Gallery");
    pencil(media,"floorPlans",534,314,"Floor plans");
    attach(media,"gallery",[21,84,1056,165],534,d.media,"photos","Gallery");
    attach(media,"floorPlans",[21,386,1056,107],534,d.media,"plan","Floor plans");
    // Scenario values patch the tutorial's sample listing without covering its native cards.
    const patches=[["MPS-46214",[1496,23,333,29]],["2 Bedroom Apartment for Sale",[1496,59,330,30]],[d.requested?"Pending review":"Draft",[1755,99,70,22]],["712",[1778,132,46,21]],["12.10.2026",[1495,276,140,19]],["12.10.2026",[1660,276,165,19]]];
    for(const [text,rect] of patches){const span=document.createElement("span");span.className="lj-scenario-patch";position(span,rect,910);span.textContent=text;frame.append(span);}
    const footer=document.createElement("footer");footer.className="lj-footer";
    const request=document.createElement("button");request.type="button";request.textContent="Request publish";request.setAttribute("aria-label","Request publish");
    request.addEventListener("click",()=>{const pending=["owner","documents","amenities","views","description","gallery","floorPlans"].filter(k=>!d[k+"Saved"]);if(pending.length){setFeedback(`Complete and save ${pending[0]==="floorPlans"?"Floor plans":pending[0]==="gallery"?"Gallery":pending[0]} before requesting publication. Scroll to that section.`);const target=content.querySelector(`[data-section="${["gallery","floorPlans"].includes(pending[0])?"media":pending[0]}"]`);target?.scrollIntoView({behavior:"smooth",block:"start"});return;}if(d.editing){setFeedback("Save your current section before requesting publication.");return;}d.requested=true;persist();next();});
    if(state.hint&&["owner","documents","amenities","views","description","gallery","floorPlans"].every(k=>d[k+"Saved"]))request.classList.add("hint-active");footer.append(request);frame.append(footer);
    requestAnimationFrame(()=>{scroller.scrollTop=(d.scrollTop||0)*(content.clientWidth/1098);});
    function showFiles(map,key,label){
      const overlay=document.createElement("div");overlay.className="lj-file-overlay";const dialog=document.createElement("section");dialog.setAttribute("role","dialog");dialog.setAttribute("aria-label",`Practice files for ${label}`);const h=document.createElement("h3");h.textContent=`${label} · practice files`;const p=document.createElement("p");p.textContent="Select a practice attachment for this simulation.";dialog.append(h,p);
      const files=map===d.documents?["Omar-title-deed.pdf","Omar-owner-ID.pdf"]:["Unit-712-photo-set (3 JPG files)","Unit-712-floor-plan.png"];
      files.forEach(file=>{const b=document.createElement("button");b.type="button";b.textContent=file;b.addEventListener("click",()=>{map[key]=file;redraw();});dialog.append(b);});
      const close=document.createElement("button");close.type="button";close.textContent="Cancel";close.addEventListener("click",()=>overlay.remove());dialog.append(close);overlay.append(dialog);frame.append(overlay);
    }
    const pending=["owner","documents","amenities","views","description","gallery","floorPlans"].find(k=>!d[k+"Saved"]);
    const instructions={owner:d.contactCreated?"Omar's new contact is linked. Select Save to draft in Listing Details.":"Scroll down to Contact. Click its plus button and create Omar's contact using the Case file.",documents:"Scroll down to Documents. Select the edit pencil, attach the title deed and owner ID to their matching sections, then save.",amenities:"Scroll down to Amenities. Select the edit pencil, choose the five amenities in the Case file, then save.",views:"Scroll down to Views. Select the edit pencil, choose the view in the Case file, then save.",description:"Scroll down to Title & Description. Select the edit pencil, enter any title and description, then save.",gallery:"Scroll down to Gallery. Select its edit pencil, add the practice photo set, then select Gallery’s Save to draft.",floorPlans:"Scroll down to Floor plans. Select its own edit pencil, add the floor plan, then select Floor plans’ Save to draft."};
    el.instruction.textContent=d.contactOpen?"Enter Omar's full name, phone and email from the Case file, then select Add client.":instructions[pending]||"All sections are saved. Review the listing, then select Request publish.";
    if(d.contactOpen)renderNewContact(frame,d,redraw);
  }
  function renderNewContact(frame,d,redraw){
    const scrim=document.createElement("div");scrim.className="lj-contact-scrim";frame.append(scrim);
    const drawer=document.createElement("section");drawer.className="lj-contact-drawer";drawer.setAttribute("role","dialog");drawer.setAttribute("aria-modal","true");drawer.setAttribute("aria-label","New contact");
    drawer.innerHTML=`<header class="lj-contact-head"><h3>New contact</h3><small>Created just now</small><div>Overview</div></header><form class="lj-contact-form"><div class="lj-contact-columns"><section class="lj-contact-fields"><h4>Details</h4><div class="lj-name-row"><label>Title<select aria-label="Contact title"><option value=""></option><option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option></select></label><label>Full name<span>*</span><input name="name" aria-label="Full name" autocomplete="off" required></label></div><label>Phone<span>*</span><div class="lj-phone-row"><input name="phone" type="tel" aria-label="Phone" placeholder="🇦🇪  +971 50 123 4567" autocomplete="off" required><select aria-label="Phone type"><option>Other</option><option>Personal</option><option>Work</option></select><b>×</b></div></label><button type="button" class="lj-add-line" data-extra="phone">⊕ Add phone number</button><label>E-mail<div class="lj-phone-row"><input name="email" type="email" aria-label="E-mail" placeholder="Enter e-mail..." autocomplete="off"><select aria-label="Email type"><option>Other</option><option>Personal</option><option>Work</option></select><b>×</b></div></label><button type="button" class="lj-add-line" data-extra="email">⊕ Add e-mail</button><div class="lj-name-row"><label>date-of-birth<input type="date" aria-label="Date of birth"></label><label>gender<select aria-label="Gender"><option value="">select-gender</option><option>Male</option><option>Female</option></select></label></div><label>employment-type<select aria-label="Employment type"><option value="">select-employment-type</option><option>Employed</option><option>Self-employed</option><option>Retired</option></select></label><label>Languages<input aria-label="Languages" placeholder="select-languages"></label><div class="lj-name-row"><label>marital-status<select aria-label="Marital status"><option value="">select-marital-status</option><option>Single</option><option>Married</option></select></label><label>Count Of Kids<input type="number" min="0" aria-label="Count of kids"></label></div><label>education-level<input aria-label="Education level" placeholder="select-education-level"></label><label>client-history<input aria-label="Client history" placeholder="client-history"></label></section><section class="lj-contact-comments"><h4>Comments</h4><textarea aria-label="Contact comments"></textarea></section></div></form><footer class="lj-contact-footer"><button type="button" data-cancel>Cancel</button><button type="button" class="lj-add-client">Add client</button></footer>`;
    const close=document.createElement("button");close.type="button";close.className="lj-drawer-close";close.textContent="×";close.setAttribute("aria-label","Close new contact");const cancel=()=>{d.contactOpen=false;redraw();};close.addEventListener("click",cancel);drawer.append(close);drawer.querySelector("[data-cancel]").addEventListener("click",cancel);
    const form=drawer.querySelector("form");form.addEventListener("submit",event=>{event.preventDefault();drawer.querySelector(".lj-add-client").click();});for(const key of ["name","phone","email"]){const n=form.elements.namedItem(key);n.value=d.contact[key]||"";n.addEventListener("input",()=>{d.contact[key]=n.value;n.classList.remove("invalid");setFeedback("");persist();});}
    const title=drawer.querySelector('[aria-label="Contact title"]');title.value=d.contact.title||"";title.addEventListener("change",()=>{d.contact.title=title.value;persist();});
    drawer.querySelectorAll("[data-extra]").forEach(button=>button.addEventListener("click",()=>{const extra=document.createElement("input");extra.type=button.dataset.extra==="phone"?"tel":"email";extra.setAttribute("aria-label",`Additional ${button.dataset.extra}`);extra.placeholder=`Additional ${button.dataset.extra}`;button.before(extra);}));
    drawer.querySelector(".lj-add-client").addEventListener("click",()=>{
      const contact=d.contact,phone=contact.phone.replace(/\D/g,"");let key="";
      if(contact.name.trim().toLowerCase()!=="omar al mansoori")key="name";
      else if(!["971505550172","0505550172","505550172"].includes(phone))key="phone";
      else if(contact.email.trim().toLowerCase()!=="omar.almansoori@example.test")key="email";
      if(key){const n=form.elements.namedItem(key);n.classList.add("invalid");n.focus();setFeedback(`Enter Omar's ${key==="name"?"full name":key} from the Case file.`);return;}
      d.owner=contact.name.trim();d.contactCreated=true;d.contactOpen=false;d.ownerSaved=false;setFeedback("Contact created. Save the listing details.",true);redraw();
    });
    frame.append(drawer);
  }

  function renderLeadForm(){
    const d=state.lead;
    const scroller=document.createElement("div");scroller.className="lead-form-scroll";position(scroller,[LEAD_FORM_VIEW.x,LEAD_FORM_VIEW.y,LEAD_FORM_VIEW.width,LEAD_FORM_VIEW.height],830);scroller.setAttribute("aria-label","Create Lead form fields");
    const content=document.createElement("div");content.className="lead-form-content";content.style.aspectRatio=`${LEAD_FORM_VIEW.width} / ${LEAD_FORM_HEIGHT}`;
    const contact=document.createElement("div");contact.className="lead-form-segment contact-segment";positionLead(contact,{x:0,y:0,width:588,height:446});content.append(contact);
    const preferences=document.createElement("div");preferences.className="lead-form-segment preferences-segment";positionLead(preferences,{x:0,y:446,width:588,height:640});content.append(preferences);
    const controls={};
    for(const field of LEAD_FIELDS){
      const control=document.createElement("input");control.type=field.type||"text";control.id=`lead-${field.id}`;control.className="crm-control";control.value=d[field.id]||"";control.placeholder=field.placeholder||"Choose an option...";control.setAttribute("aria-label",`${field.label}${field.required?" (required)":""}`);positionLead(control,field);
      if(field.options?.length){const list=document.createElement("datalist");list.id=`lead-options-${field.id}`;for(const value of field.options){const option=document.createElement("option");option.value=value;list.append(option);}control.setAttribute("list",list.id);content.append(list);}
      control.addEventListener("input",()=>{d[field.id]=control.value;control.classList.remove("field-error","hint-field");if(field.id==="smartLocation"){const match=LEAD_SMART_LOCATIONS.find(x=>x.label===control.value);if(match){Object.assign(d,match.values);leadFormScrollTop=scroller.scrollTop;persist();render();return;}}persist();});
      content.append(control);controls[field.id]=control;
    }
    scroller.append(content);scroller.addEventListener("scroll",()=>{leadFormScrollTop=scroller.scrollTop;updateLeadScrollbar(scroller,thumb);},{passive:true});el.layer.append(scroller);
    const scrollbar=document.createElement("div");scrollbar.className="form-scrollbar";position(scrollbar,[1244,123,20,640],830);const thumb=document.createElement("div");thumb.className="form-scroll-thumb";scrollbar.append(thumb);el.layer.append(scrollbar);
    requestAnimationFrame(()=>{scroller.scrollTop=leadFormScrollTop;updateLeadScrollbar(scroller,thumb);});
    const footer=document.createElement("div");footer.className="lead-modal-footer";position(footer,[1064,763,200,67],830);const submit=document.createElement("button");submit.type="button";submit.className="submit-hotspot";submit.textContent="Submit";submit.setAttribute("aria-label","Submit lead");footer.append(submit);el.layer.append(footer);
    submit.addEventListener("click",()=>{const required=["name","mobile","email","source","customerType","region","city"];const missing=required.filter(k=>!String(d[k]||"").trim());if(missing.length){state.hint=true;setFeedback("Complete the required contact and location fields.");leadFormScrollTop=Math.max(0,(LEAD_FIELDS.find(x=>x.id===missing[0])?.y||0)-250);render();return;}const correct=d.name.trim()==="Saira Khan"&&d.source==="Personal Client"&&d.customerType==="Buyer"&&d.city==="Dubai"&&d.district==="Downtown Dubai"&&d.listingType==="Sale"&&d.minBed==="2"&&d.maxBed==="2"&&Number(String(d.maxPrice).replace(/\D/g,""))===5000000;if(!correct){state.hint=true;setFeedback("Check Saira's source, customer type and preferences against the Case File.");leadFormScrollTop=520;render();return;}leadFormScrollTop=0;next();});
    if(state.hint){const required=["name","mobile","email","source","customerType","region","city"];const first=required.find(k=>!d[k])||(["source","customerType","district","listingType","minBed","maxBed","maxPrice"].find(k=>!d[k]));controls[first]?.classList.add("hint-field");}
  }

  function positionLead(node,r){node.style.left=pct(r.x,LEAD_FORM_VIEW.width);node.style.top=pct(r.y,LEAD_FORM_HEIGHT);node.style.width=pct(r.width,LEAD_FORM_VIEW.width);node.style.height=pct(r.height,LEAD_FORM_HEIGHT);}
  function updateLeadScrollbar(scroller,thumb){const ratio=Math.min(1,scroller.clientHeight/scroller.scrollHeight);const progress=scroller.scrollHeight===scroller.clientHeight?0:scroller.scrollTop/(scroller.scrollHeight-scroller.clientHeight);thumb.style.height=`${ratio*100}%`;thumb.style.top=`${progress*(1-ratio)*100}%`;}

  function renderContact(scene){
    const selected=(rect,label)=>{const b=document.createElement("button");b.type="button";b.className="choice selected";b.textContent=label;position(b,rect);b.tabIndex=-1;el.layer.append(b);};
    if(scene.id==="no-answer")selected([438,624,81,55],"Call");
    const b=document.createElement("button");b.type="button";b.className=`hotspot${state.hint?" hint-active":""}`;b.setAttribute("aria-label",scene.label);position(b,scene.target);b.addEventListener("click",next);el.layer.append(b);
  }

  function renderFollowupMenu(){
    const menu=document.createElement("div");menu.className="followup-menu";menu.setAttribute("role","menu");position(menu,[1285,590,156,111]);
    for(const [label,icon] of [["Meeting","▣"],["Call","☎"],["Task","✓"]]){
      const button=document.createElement("button");button.type="button";button.setAttribute("role","menuitem");button.innerHTML=`<span aria-hidden="true">${icon}</span><span>${label}</span>`;
      if(label==="Call"){button.className=state.hint?"hint-active":"";button.addEventListener("click",next);}else button.addEventListener("click",()=>setFeedback("Choose Call for this follow-up."));
      menu.append(button);
    }
    el.layer.append(menu);
  }

  function renderFollowupForm(){
    const f=state.followup;
    const title=addControl("input","follow-title",[676,264,568,52],f.title);title.placeholder="Enter a title";title.setAttribute("aria-label","Follow-up title");
    const note=addControl("textarea","follow-note",[676,357,568,107],f.note);note.placeholder="Enter your note here...";note.setAttribute("aria-label","Follow-up note");
    for(const [n,k] of [[title,"title"],[note,"note"]])n.addEventListener("input",()=>{f[k]=n.value;n.classList.remove("invalid","hint-active");persist();});

    const makeChoices=(field,rect,choices,className)=>{const group=document.createElement("div");group.className=`followup-choice-group ${className}`;group.setAttribute("role","group");group.setAttribute("aria-label",field==="priority"?"Priority":field==="direction"?"Call direction":"Follow-up date");position(group,rect);for(const [label,value] of choices){const button=document.createElement("button");button.type="button";button.className=f[field]===value?"selected":"";button.textContent=label;button.setAttribute("aria-pressed",String(f[field]===value));button.addEventListener("click",()=>{f[field]=value;persist();render();});group.append(button);}el.layer.append(group);return group;};
    const priority=makeChoices("priority",[677,498,266,33],[["Normal","Normal"],["Urgent","Urgent"],["High","High"],["Low","Low"]],"priority");
    const direction=makeChoices("direction",[675,565,174,34],[["Incoming","Incoming"],["Outgoing","Outgoing"]],"direction");
    const dateChoices=makeChoices("date",[713,620,171,35],[["Today","2026-10-14"],["Tomorrow","2026-10-15"]],"date");
    const date=addControl("input","follow-date",[914,618,137,40],f.date);date.type="date";date.classList.add("followup-inline-control");date.setAttribute("aria-label","Follow-up date shown as month/day/year");date.addEventListener("change",()=>{if(date.value){f.date=date.value;persist();render();}});

    const timeTrigger=document.createElement("button");timeTrigger.type="button";timeTrigger.className=`followup-time-trigger${f.time?" selected":""}`;timeTrigger.innerHTML=`<span aria-hidden="true">◷</span><span>${f.time||"Select time"}</span>`;timeTrigger.setAttribute("aria-label","Select follow-up time");timeTrigger.setAttribute("aria-expanded",String(followupTimePickerOpen));position(timeTrigger,[1093,618,152,40]);timeTrigger.addEventListener("click",()=>{if(f.time){const parts=f.time.split(":").map(Number);followupTimeDraft={hour:parts[0],minute:parts[1]};}followupTimePickerOpen=!followupTimePickerOpen;render();});el.layer.append(timeTrigger);
    if(followupTimePickerOpen){
      const picker=document.createElement("section");picker.className="followup-time-picker";picker.setAttribute("role","dialog");picker.setAttribute("aria-label","Choose follow-up time");position(picker,[1033,283,263,326]);
      const wheels=document.createElement("div");wheels.className="followup-time-wheels";
      const makeWheel=(unit,limit)=>{const col=document.createElement("div");col.className="followup-time-column";const change=delta=>{followupTimeDraft={...followupTimeDraft,[unit]:(followupTimeDraft[unit]+delta+limit)%limit};render();};const up=document.createElement("button");up.type="button";up.textContent="⌃";up.setAttribute("aria-label",`Increase ${unit}`);up.addEventListener("click",()=>change(1));const value=document.createElement("strong");value.textContent=String(followupTimeDraft[unit]).padStart(2,"0");const down=document.createElement("button");down.type="button";down.textContent="⌄";down.setAttribute("aria-label",`Decrease ${unit}`);down.addEventListener("click",()=>change(-1));col.addEventListener("wheel",event=>{event.preventDefault();change(event.deltaY>0?1:-1);},{passive:false});col.append(up,value,down);return col;};
      wheels.append(makeWheel("hour",24));const separator=document.createElement("span");separator.textContent=":";wheels.append(separator,makeWheel("minute",60));
      const footer=document.createElement("div");footer.className="followup-time-footer";const preview=document.createElement("span");preview.textContent=`${String(followupTimeDraft.hour).padStart(2,"0")}:${String(followupTimeDraft.minute).padStart(2,"0")}`;const cancel=document.createElement("button");cancel.type="button";cancel.textContent="Cancel";cancel.addEventListener("click",()=>{followupTimePickerOpen=false;render();});const select=document.createElement("button");select.type="button";select.className="select";select.textContent="Select";select.addEventListener("click",()=>{f.time=preview.textContent;followupTimePickerOpen=false;persist();render();});const actions=document.createElement("div");actions.append(cancel,select);footer.append(preview,actions);picker.append(wheels,footer);el.layer.append(picker);
    }

    if(state.hint){if(!f.title)title.classList.add("hint-active");else if(!f.direction)direction.classList.add("hint-active");else if(!f.date)dateChoices.classList.add("hint-active");else if(!f.time)timeTrigger.classList.add("hint-active");}
    const submit=document.createElement("button");submit.type="button";submit.className="followup-create";submit.textContent="Create";submit.setAttribute("aria-label","Create follow-up call");position(submit,[1147,692,98,52]);submit.addEventListener("click",()=>{f.title=title.value;f.note=note.value;const ok=f.title.trim().length>=3&&f.direction==="Outgoing"&&f.date==="2026-10-14"&&f.time==="14:00";if(!ok){state.hint=true;setFeedback("Set a title, select Outgoing, choose Today (14 October 2026), and set 2:00 PM.");render();return;}followupTimePickerOpen=false;next();});el.layer.append(submit);
  }

  function renderCompleteFollowup(scene){
    const title=document.createElement("div");title.className="scheduled-title";title.textContent=state.followup.title||"Follow-up call";position(title,[1269,638,120,24]);el.layer.append(title);
    const time=document.createElement("div");time.className="scheduled-time";time.textContent=state.followup.time||"14:00";position(time,[1390,638,43,24]);el.layer.append(time);
    const hoverZone=document.createElement("div");hoverZone.className="followup-hover-zone";hoverZone.setAttribute("aria-label","Scheduled follow-up");position(hoverZone,[1205,596,236,91]);
    const complete=document.createElement("button");complete.type="button";complete.className=`completion-hotspot${state.hint?" hint-active":""}`;complete.setAttribute("aria-label",scene.label);complete.title=scene.label;complete.style.left=`${(194/236)*100}%`;complete.style.top=`${(12/91)*100}%`;complete.style.width=`${(38/236)*100}%`;complete.style.height=`${(38/91)*100}%`;complete.addEventListener("click",next);hoverZone.append(complete);el.layer.append(hoverZone);
  }

  function renderQualify(){
    const q=state.qualify;
    const defs=[
      ["finance",[920,355,214,48],["Cash","Mortgage","Mortgage pre-approved"]],["budget",[466,442,214,48],["2M - 3M","3M - 5M","5M +"]],
      ["timeline",[694,442,214,48],["Immediate","1 month","2 months","3-6 months"]],["interest",[920,442,214,48],["Cold","Warm","Hot"]],
      ["nationality",[466,529,326,48],["Canadian","British","Indian","Pakistani","Emirati"]],["languages",[806,529,328,48],["English","Arabic","Hindi","Urdu"]]
    ];
    const nodes={};for(const [id,r,o] of defs){const n=addControl("select",`q-${id}`,r,q[id],o);n.addEventListener("change",()=>{q[id]=n.value;persist();});nodes[id]=n;}
    const response=addControl("textarea","q-response",[466,617,668,103],q.response);response.addEventListener("input",()=>{q.response=response.value;persist();});
    const done=document.createElement("button");done.type="button";done.className="native-button";done.textContent="Done";position(done,[1044,270,90,41]);done.addEventListener("click",()=>{q.response=response.value;const ok=q.budget==="3M - 5M"&&q.timeline==="2 months"&&q.interest==="Warm";if(!ok){state.hint=true;setFeedback("Budget, Timeline and Level of Interest must match Saira's Case File.");for(const k of ["budget","timeline","interest"])if(!q[k]){nodes[k].classList.add("hint-active");break;}return;}next();});el.layer.append(done);
  }

  function positionQualification(node,r){node.style.left=pct(r[0],1100);node.style.top=pct(r[1],1470);node.style.width=pct(r[2],1100);node.style.height=pct(r[3],1470);}

  function renderQualificationJourney(){
    const q=state.qualify;
    const shell=document.createElement("div");shell.className="qualification-shell";position(shell,[409,0,1100,780]);
    const scroller=document.createElement("div");scroller.className="qualification-scroller";scroller.setAttribute("aria-label","Scrollable lead details");
    const content=document.createElement("div");content.className="qualification-content";
    const top=document.createElement("div");top.className="qualification-segment qualification-top";positionQualification(top,[0,0,1100,780]);content.append(top);
    const lower=document.createElement("div");lower.className="qualification-segment qualification-lower";positionQualification(lower,[0,780,1100,584]);content.append(lower);
    const contextIdentity=document.createElement("div");contextIdentity.className="lead-identity-patch";positionQualification(contextIdentity,[45,177,480,103]);contextIdentity.innerHTML=`<strong>Saira Khan</strong><span>Personal phone&nbsp;&nbsp; +971 50 555 0147</span><span>Personal email&nbsp;&nbsp; saira.khan@example.test</span>`;content.append(contextIdentity);
    const contextSource=document.createElement("div");contextSource.className="lead-source-patch";positionQualification(contextSource,[871,187,170,38]);contextSource.textContent="Bayut.com";content.append(contextSource);
    const contextStage=document.createElement("div");contextStage.className="lead-stage-patch";positionQualification(contextStage,[883,157,115,34]);contextStage.textContent="Contacted";content.append(contextStage);
    const contextListing=document.createElement("div");contextListing.className="lead-listing-patch";positionQualification(contextListing,[58,345,667,55]);contextListing.innerHTML=`<strong>${TARGET_LISTING}</strong><span>Unit 712 · Imperial Avenue · Downtown Dubai</span>`;content.append(contextListing);
    const contextPreference=document.createElement("div");contextPreference.className="lead-preference-patch";positionQualification(contextPreference,[58,492,667,70]);contextPreference.textContent="Sale · Downtown Dubai · 2–3 bedrooms · Up to AED 5M";content.append(contextPreference);
    const contactedState=document.createElement("div");contactedState.className="lead-response-patch";positionQualification(contactedState,[33,718,248,49]);contactedState.innerHTML=`<span>Contacted</span><span>No Answer</span>`;content.append(contactedState);
    const addField=(tag,id,rect,value,options=[])=>{const n=document.createElement(tag);n.id=id;n.className="qualification-control";positionQualification(n,rect);if(tag==="select"){const blank=document.createElement("option");blank.value="";blank.textContent="Choose an option...";n.append(blank);for(const item of options){const o=document.createElement("option");o.value=item;o.textContent=item;n.append(o);}}n.value=value||"";content.append(n);return n;};
    if(!state.qualifyEditing){
      const edit=document.createElement("button");edit.type="button";edit.className=`qualification-edit${state.hint?" hint-active":""}`;edit.textContent="Edit";edit.setAttribute("aria-label","Edit qualification details");positionQualification(edit,[645,854,80,43]);edit.addEventListener("click",()=>{state.qualifyEditing=true;qualificationScrollTop=Math.max(scroller.scrollTop,500);persist();render();});content.append(edit);
      if(state.hint)qualificationScrollTop=520;
    }else{
      const defs=[
        ["customerSubType",[284,939,214,48],["Investor","End User","First-time Buyer"]],
        ["finance",[511,939,214,48],["Cash","Mortgage","Mortgage pre-approved"]],
        ["budget",[57,1026,214,48],["2M - 3M","3M - 5M","5M +"]],
        ["timeline",[284,1026,214,48],["Immediate","1 month","2 months","3-6 months"]],
        ["interest",[511,1026,214,48],["Cold","Warm","Hot"]],
        ["nationality",[57,1113,326,48],["Canadian","British","Indian","Pakistani","Emirati"]],
        ["languages",[397,1113,328,48],["English","Arabic","Hindi","Urdu"]]
      ];
      const nodes={};for(const [id,rect,options] of defs){const n=addField("select",`qualify-${id}`,rect,q[id],options);n.setAttribute("aria-label",id);n.addEventListener("change",()=>{q[id]=n.value;n.classList.remove("invalid","hint-active");persist();});nodes[id]=n;}
      const response=addField("textarea","qualify-response",[57,1201,668,103],q.response);response.setAttribute("aria-label","Customer Response");response.addEventListener("input",()=>{q.response=response.value;persist();});
      const done=document.createElement("button");done.type="button";done.className="qualification-done";done.textContent="Done";done.setAttribute("aria-label","Save qualification details");positionQualification(done,[645,854,80,43]);done.addEventListener("click",()=>{q.response=response.value;const ok=q.budget==="3M - 5M"&&q.timeline==="2 months"&&q.interest==="Warm";if(!ok){state.hint=true;qualificationScrollTop=450;setFeedback("Budget, Timeline and Level of Interest must match the follow-up conversation in the Case File.");for(const k of ["budget","timeline","interest"])if(q[k]!==({budget:"3M - 5M",timeline:"2 months",interest:"Warm"})[k])nodes[k].classList.add("invalid","hint-active");persist();return;}state.qualifyEditing=false;qualificationScrollTop=0;next();});content.append(done);
      if(state.hint){qualificationScrollTop=500;for(const k of ["budget","timeline","interest"])if(!q[k]){nodes[k].classList.add("hint-active");break;}}
    }
    scroller.append(content);shell.append(scroller);el.layer.append(shell);
    scroller.addEventListener("scroll",()=>{qualificationScrollTop=scroller.scrollTop;},{passive:true});
    requestAnimationFrame(()=>{scroller.scrollTop=qualificationScrollTop;});
  }

  function renderFilters(){
    const f=state.filters;
    const FILTER_X=789,FILTER_Y=140,FILTER_W=1131,FILTER_VIEW_H=564,FILTER_CONTENT_H=1224;
    const blankFilters=()=>({category:"",photos:"",propertyFor:"",smartLocation:"",region:"",city:"",district:"",subDistrict:"",building:"",tower:"",buildingNo:"",listingSource:"",exclusive:"",owner:"",listingType:"",ref:"",unit:"",furnishing:"",bedrooms:[],baths:"",minArea:"",maxArea:"",minPrice:"",maxPrice:"",portals:"",status:"",propertyCategory:"",marketedAgent:"",assignTo:"",company:""});
    const topMissing=()=>f.propertyFor!=="Sale"||f.region!=="United Arab Emirates"||f.city!=="Dubai"||f.district!=="Downtown Dubai";
    const lowerMissing=()=>!f.bedrooms.includes(2)||!f.bedrooms.includes(3)||Number(String(f.maxPrice).replace(/\D/g,""))!==5000000;
    const invalidMinPrice=()=>String(f.minPrice).trim()!==""&&Number(String(f.minPrice).replace(/\D/g,""))!==3000000;
    const shell=document.createElement("div");shell.className="filter-scroll-shell";position(shell,[FILTER_X,FILTER_Y,FILTER_W,FILTER_VIEW_H]);shell.setAttribute("aria-label","Scrollable All Filters form");
    const content=document.createElement("div");content.className="filter-scroll-content";content.style.height=`${(FILTER_CONTENT_H/FILTER_VIEW_H)*100}%`;
    const segment=(src,top,sourceY,height)=>{const wrap=document.createElement("div");wrap.className="filter-photo-segment";wrap.style.top=pct(top,FILTER_CONTENT_H);wrap.style.height=pct(height,FILTER_CONTENT_H);const img=document.createElement("img");img.src=`assets/images/${src}`;img.alt="";img.style.width=pct(1920,FILTER_W);img.style.height=pct(780,height);img.style.left=pct(-FILTER_X,FILTER_W);img.style.top=pct(-sourceY,height);wrap.append(img);content.append(wrap);};
    segment("options-filters.webp",0,140,310);
    segment("options-filters-middle.webp",310,109,560);
    segment("options-filters-lower.webp",870,350,354);
    const sourceScrollbarCover=document.createElement("span");sourceScrollbarCover.className="filter-source-scrollbar-cover";content.append(sourceScrollbarCover);
    const place=(node,rect)=>{node.style.left=pct(rect[0],FILTER_W);node.style.top=pct(rect[1],FILTER_CONTENT_H);node.style.width=pct(rect[2],FILTER_W);node.style.height=pct(rect[3],FILTER_CONTENT_H);};
    const topRect=([x,y,w,h])=>[x-FILTER_X,y-140,w,h];
    const middleRect=([x,y,w,h])=>[x-FILTER_X,310+y-109,w,h];
    const lowerRect=([x,y,w,h])=>[x-FILTER_X,870+y-350,w,h];
    const addFilter=(tag,id,rect,key,options=[])=>{const n=document.createElement(tag);n.id=id;n.className="form-control filter-overlay-control";place(n,rect);if(tag==="select"){const blank=document.createElement("option");blank.value="";blank.textContent="Choose an option...";n.append(blank);for(const item of options){const o=document.createElement("option");o.value=item;o.textContent=item;n.append(o);}}n.value=f[key]||"";n.setAttribute("aria-label",key.replace(/([A-Z])/g," $1"));if(tag==="input")n.inputMode=["minArea","maxArea","minPrice","maxPrice"].includes(key)?"numeric":"text";n.addEventListener(tag==="input"?"input":"change",()=>{f[key]=n.value;n.classList.remove("invalid","hint-active");persist();});content.append(n);return n;};

    addFilter("select","filter-category",topRect([812,185,338,48]),"category",["Apartment","Villa","Townhouse","Penthouse","Land Residential"]);
    addFilter("select","filter-photos",topRect([1165,185,338,48]),"photos",["With photos","Without photos"]);
    const propertyFor=addFilter("select","filter-property-for",topRect([1518,185,338,48]),"propertyFor",["Sale","Rent"]);
    const smart=addFilter("select","filter-smart-location",topRect([812,287,276,48]),"smartLocation",["Downtown Dubai, Dubai, United Arab Emirates","Dubai Marina, Dubai, United Arab Emirates","Business Bay, Dubai, United Arab Emirates","Palm Jumeirah, Dubai, United Arab Emirates"]);
    const region=addFilter("select","filter-region",topRect([812,389,250,48]),"region",["United Arab Emirates"]);
    const city=addFilter("select","filter-city",topRect([1077,389,249,48]),"city",["Dubai","Abu Dhabi","Sharjah","Ajman","Ras Al Khaimah"]);
    const district=addFilter("select","filter-district",topRect([1342,389,249,48]),"district",["Downtown Dubai","Dubai Marina","Business Bay","Palm Jumeirah","Al Furjan"]);
    addFilter("select","filter-subdistrict",topRect([1606,389,249,48]),"subDistrict",["Downtown Views II","Old Town","Opera District","Marina Gate","Jumeirah Beach Residence"]);

    addFilter("select","filter-building",middleRect([812,133,338,43]),"building",["Imperial Avenue","Burj Khalifa","Address Downtown","Marina Gate 1","Marina Gate 2"]);
    addFilter("select","filter-tower",middleRect([1165,133,338,43]),"tower",["Tower A","Tower B","North Tower","South Tower"]);
    addFilter("select","filter-building-no",middleRect([1518,133,338,43]),"buildingNo",["1","2","3","4"]);
    addFilter("select","filter-listing-source",middleRect([812,221,514,43]),"listingSource",["Internal Listing","External Listing","Developer Listing","Pocket Listing"]);
    addFilter("select","filter-exclusive",middleRect([1342,221,514,43]),"exclusive",["Yes","No"]);
    addFilter("select","filter-owner",middleRect([812,309,514,43]),"owner",["Omar Al Mansoori","Company Client","Personal Client"]);
    addFilter("select","filter-listing-type",middleRect([1342,309,514,43]),"listingType",["Live","Verified","Pocket"]);
    addFilter("input","filter-ref",middleRect([812,397,514,43]),"ref");addFilter("input","filter-unit",middleRect([1342,397,514,43]),"unit");
    addFilter("select","filter-furnishing",middleRect([812,486,338,43]),"furnishing",["Furnished","Unfurnished","Partly Furnished"]);
    const beds=document.createElement("div");beds.className="filter-bed-multiselect";place(beds,middleRect([1165,480,338,82]));beds.setAttribute("aria-label","Beds multi-select");const selectedBeds=document.createElement("div");selectedBeds.className="filter-bed-pills";selectedBeds.innerHTML=f.bedrooms.length?f.bedrooms.map(n=>`<span>${n} ×</span>`).join(""):"<span class=\"placeholder\">Select bedrooms</span>";const bedTrigger=document.createElement("button");bedTrigger.type="button";bedTrigger.className="filter-bed-trigger";bedTrigger.textContent=f.bedrooms.length?f.bedrooms.join(", "):"Select value";bedTrigger.setAttribute("aria-expanded",String(filterBedsOpen));bedTrigger.addEventListener("click",()=>{filterBedsOpen=!filterBedsOpen;filterScrollTop=shell.scrollTop;render();});beds.append(selectedBeds,bedTrigger);if(filterBedsOpen){const menu=document.createElement("div");menu.className="filter-bed-menu";for(const n of ["Studio",1,2,3,4,5]){const option=document.createElement("button");option.type="button";option.classList.toggle("selected",f.bedrooms.includes(n));option.innerHTML=`<span>${f.bedrooms.includes(n)?"✓":""}</span>${n}`;option.addEventListener("click",()=>{f.bedrooms=f.bedrooms.includes(n)?f.bedrooms.filter(x=>x!==n):[...f.bedrooms,n];filterBedsOpen=true;filterScrollTop=shell.scrollTop;persist();render();});menu.append(option);}beds.append(menu);}if(state.hint&&(!f.bedrooms.includes(2)||!f.bedrooms.includes(3)))beds.classList.add("hint-active");content.append(beds);
    addFilter("select","filter-baths",middleRect([1518,486,338,43]),"baths",["1","2","3","4","5","6+"]);
    addFilter("input","filter-min-area",middleRect([812,607,249,43]),"minArea");addFilter("input","filter-max-area",middleRect([1077,607,249,43]),"maxArea");
    const minPrice=addFilter("input","filter-min-price",middleRect([1342,607,249,43]),"minPrice");const maxPrice=addFilter("input","filter-max-price",middleRect([1606,607,249,43]),"maxPrice");

    addFilter("select","filter-portals",lowerRect([812,400,338,43]),"portals",["Bayut","Property Finder","Dubizzle","Website"]);
    addFilter("select","filter-status",lowerRect([1165,435,338,43]),"status",["Published","Unpublished","Draft"]);
    addFilter("select","filter-property-category",lowerRect([1518,400,338,43]),"propertyCategory",["Residential","Commercial","Residential / Commercial"]);
    addFilter("select","filter-marketed-agent",lowerRect([812,517,338,43]),"marketedAgent",["My listings","Metropolitan agent","External agent"]);
    addFilter("select","filter-assign-to",lowerRect([812,604,514,43]),"assignTo",["Me","Sales team","Listing team"]);
    addFilter("select","filter-company",lowerRect([1342,604,514,43]),"company",["Metropolitan Premium Properties","Metropolitan Capital Real Estate"]);

    const topCursor=document.createElement("span");topCursor.className="screenshot-cursor-cover";place(topCursor,[1088-FILTER_X,276-140,38,42]);content.append(topCursor);
    const middleCursor=document.createElement("span");middleCursor.className="screenshot-cursor-cover";place(middleCursor,middleRect([1643,425,38,38]));content.append(middleCursor);
    const lowerCursor=document.createElement("span");lowerCursor.className="screenshot-cursor-cover";place(lowerCursor,lowerRect([1643,435,38,38]));content.append(lowerCursor);
    smart.addEventListener("change",()=>{if(!smart.value)return;const selected=smart.value.split(",")[0];f.region="United Arab Emirates";f.city="Dubai";f.district=selected;f.subDistrict=selected==="Downtown Dubai"?"Opera District":selected==="Dubai Marina"?"Marina Gate":"";region.value=f.region;city.value=f.city;district.value=f.district;persist();});
    if(state.hint&&topMissing())for(const n of [propertyFor,region,city,district])n.classList.add("hint-active");
    if(state.hint&&invalidMinPrice())minPrice.classList.add("hint-active");
    if(state.hint&&Number(String(f.maxPrice).replace(/\D/g,""))!==5000000)maxPrice.classList.add("hint-active");
    shell.append(content);el.layer.append(shell);shell.addEventListener("scroll",()=>{filterScrollTop=shell.scrollTop;},{passive:true});requestAnimationFrame(()=>{shell.scrollTo({top:filterScrollTop,behavior:"smooth"});});
    const footer=document.createElement("div");footer.className="filter-fixed-footer";position(footer,[520,704,1400,76]);const footerImage=document.createElement("img");footerImage.src="assets/images/options-filters-lower.webp";footerImage.alt="";footer.append(footerImage);el.layer.append(footer);
    const reset=document.createElement("button");reset.type="button";reset.className="filter-reset-hotspot";reset.textContent="Reset filter";position(reset,[570,728,143,41]);reset.addEventListener("click",()=>{state.filters=blankFilters();state.hint=false;feedbackText="";filterScrollTop=0;persist();render();});el.layer.append(reset);
    const apply=document.createElement("button");apply.type="button";apply.className="filter-apply-hotspot";apply.textContent="Apply Filters";position(apply,[1739,727,132,42]);apply.addEventListener("click",()=>{if(topMissing()){state.hint=true;filterScrollTop=0;setFeedback("Use Saira's location criteria from the Case File.");persist();render();return;}if(invalidMinPrice()){state.hint=true;filterScrollTop=520;setFeedback("Enter AED 3,000,000 for Minimum Price.");persist();render();return;}if(lowerMissing()){state.hint=true;filterScrollTop=520;setFeedback("Use Saira's 2–3 bedroom range and maximum-price criteria from the Case File.");persist();render();return;}next();});el.layer.append(apply);
  }

  function renderCopy(){
    const number=document.createElement("span");number.className=`listing-detail-copy-number${state.hint?" hint-active":""}`;number.tabIndex=0;number.setAttribute("aria-label",`Listing number ${TARGET_LISTING}; select and copy`);number.textContent=TARGET_LISTING;position(number,[883,197,87,26]);
    const select=()=>{number.focus();const range=document.createRange();range.selectNodeContents(number);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);};
    number.addEventListener("click",select);number.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();select();}});number.addEventListener("contextmenu",()=>{if(window.getSelection()?.toString().trim()!==TARGET_LISTING)select();});el.layer.append(number);
  }
  document.addEventListener("copy",event=>{
    if(scenes[state.scene]?.id!=="copy-listing")return;
    const number=el.layer.querySelector(".listing-detail-copy-number"),selection=window.getSelection();
    if(!number||selection?.toString().trim()!==TARGET_LISTING||!number.contains(selection.anchorNode)||!number.contains(selection.focusNode))return;
    if(event.clipboardData){event.clipboardData.setData("text/plain",TARGET_LISTING);event.preventDefault();}
    state.copied=TARGET_LISTING;persist();setTimeout(()=>{if(scenes[state.scene]?.id==="copy-listing")next();},0);
  });
  function renderLeadTarget(){const early=scenes[state.scene].id==="open-qualify-lead";const b=document.createElement("button");b.type="button";b.className=`lead-card-target lead-scenario-row${state.hint?" hint-active":""}`;b.setAttribute("aria-label","Open Saira Khan Bayut lead");b.innerHTML=`<span class="lead-avatar">SK</span><span><strong>Saira Khan</strong><small>MP-G-46214</small></span><span><small>Status</small><b class="${early?"status-no-answer":"status-qualified"}">${early?"No Answer":"Qualified"}</b></span><span><small>Source</small><strong>Bayut.com</strong></span><span><small>Linked listing</small><strong>${TARGET_LISTING}</strong></span><span><small>Customer Type</small><b class="status-buyer">Buyer</b></span>`;position(b,[350,365,1494,87]);b.addEventListener("click",next);el.layer.append(b);}

  function renderOptionModal(){
    const m=document.createElement("section");m.className="modal-card";m.innerHTML=`<h3>Add Option Sent</h3><label class="field">Listing number<input id="listingSearch" placeholder="Search by REF or listing number"></label><div id="listingResult"></div><div class="sheet-actions"><button class="cancel" type="button">Cancel</button><button class="save" type="button">Submit</button></div>`;
    const input=m.querySelector("#listingSearch"), result=m.querySelector("#listingResult");
    input.value=state.optionInput||"";const update=()=>{state.optionInput=input.value.trim().toUpperCase();state.optionSelected=false;if(state.optionInput===TARGET_LISTING){result.innerHTML=`<div class="result-card"><button type="button"><strong>${TARGET_LISTING}</strong><br>Luxury Furnished | Fully Upgraded | Burj View</button></div>`;result.querySelector("button").addEventListener("click",()=>{state.optionSelected=true;result.querySelector(".result-card").style.borderColor="#0b3d95";setFeedback("Listing selected. Submit it to Options Sent.",true);});}else result.replaceChildren();persist();};input.addEventListener("input",update);update();
    m.querySelector(".cancel").addEventListener("click",()=>setFeedback("Complete the current step before closing the window."));m.querySelector(".save").addEventListener("click",()=>{if(state.copied!==TARGET_LISTING||state.optionInput!==TARGET_LISTING||!state.optionSelected){state.hint=true;input.classList.add("invalid");setFeedback("Paste the copied listing number and select the matching result before submitting.");return;}next();});el.layer.append(m);
  }

  function renderViewingForm(){
    const v=state.viewing;
    const addHour=value=>{if(!/^\d{2}:\d{2}$/.test(value||""))return"";const [hour,minute]=value.split(":").map(Number);return`${String((hour+1)%24).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;};
    const cursorCover=document.createElement("span");cursorCover.className="viewing-cursor-cover";position(cursorCover,[1183,286,43,43]);el.layer.append(cursorCover);
    const date=addControl("input","view-date",[600,240,230,48],v.date);date.type="date";
    const time=addControl("input","view-time",[845,240,230,48],v.time);time.type="time";
    const endTime=addControl("input","view-end-time",[1092,240,230,48],v.endTime);endTime.type="time";
    const type=addControl("select","view-type",[600,333,720,48],v.type,["Viewing","Meeting"]);
    const search=addControl("input","view-listing-search",[600,444,720,48],v.search||v.listing);search.placeholder="Search by REF or listing number...";
    date.addEventListener("change",()=>{v.date=date.value;persist();});
    time.addEventListener("change",()=>{v.time=time.value;v.endTime=addHour(v.time);endTime.value=v.endTime;persist();});
    endTime.addEventListener("change",()=>{v.endTime=endTime.value;persist();});
    type.addEventListener("change",()=>{v.type=type.value;persist();});
    search.addEventListener("input",()=>{v.search=search.value.toUpperCase();search.value=v.search;v.listing=v.search.trim()===TARGET_LISTING?TARGET_LISTING:"";suggestion.classList.toggle("selected",v.listing===TARGET_LISTING);persist();});
    const suggestion=document.createElement("button");suggestion.type="button";suggestion.className=`viewing-suggestion${v.listing===TARGET_LISTING?" selected":""}`;suggestion.setAttribute("aria-label",`Select suggested listing ${TARGET_LISTING}`);position(suggestion,[600,503,720,82]);suggestion.addEventListener("click",()=>{v.listing=TARGET_LISTING;v.search=TARGET_LISTING;search.value=TARGET_LISTING;suggestion.classList.add("selected");persist();setFeedback(`${TARGET_LISTING} selected from Options Sent.`,true);});el.layer.append(suggestion);
    const save=document.createElement("button");save.type="button";save.className="native-button";save.textContent="Save";position(save,[1240,706,80,48]);save.addEventListener("click",()=>{v.date=date.value;v.time=time.value;v.endTime=endTime.value;v.type=type.value;v.search=search.value.toUpperCase();const toMinutes=value=>{const parts=(value||"").split(":").map(Number);return parts.length===2?parts[0]*60+parts[1]:-1;};const correct=v.date==="2026-10-15"&&v.time==="16:00"&&toMinutes(v.endTime)>toMinutes(v.time)&&v.type==="Viewing"&&v.listing===TARGET_LISTING;if(!correct){state.hint=true;setFeedback("Check the agreed date, start time, end time, type and suggested listing.");for(const n of [date,time,endTime,type,search])if(!n.value){n.classList.add("hint-active");break;}if(v.listing!==TARGET_LISTING)suggestion.classList.add("hint-active");return;}next();});el.layer.append(save);
  }

  function addFeedbackDatePatch(){
    const patch=document.createElement("div");patch.className="feedback-date-patch";patch.innerHTML="<small>OCT</small><strong>15</strong><span>16:00</span>";position(patch,[443,638,69,66]);el.layer.append(patch);
  }

  function renderFeedbackTarget(){
    addFeedbackDatePatch();
    const button=document.createElement("button");button.type="button";button.className=`viewing-feedback-target${state.hint?" hint-active":""}`;button.setAttribute("aria-label","Open feedback for Saira's viewing");position(button,[961,639,107,38]);button.addEventListener("click",next);el.layer.append(button);
  }

  function renderFeedbackForm(){
    const feedback=state.viewingFeedback;
    const rows=[["community",235,"Community"],["location",271,"Location"],["floor",307,"Floor"],["view",343,"View"],["floorPlan",379,"Floor plan layout"],["builtArea",415,"Built-up area"],["condition",451,"Condition"]];
    for(const [key,y,label] of rows){
      const row=document.createElement("div");row.className="feedback-stars";row.setAttribute("role","group");row.setAttribute("aria-label",`${label} rating`);position(row,[1017,y,151,29]);
      for(let value=1;value<=5;value++){const star=document.createElement("button");star.type="button";star.textContent=value<=feedback[key]?"★":"☆";star.setAttribute("aria-label",`${value} out of 5`);star.classList.toggle("selected",value<=feedback[key]);star.addEventListener("click",()=>{feedback[key]=value;persist();render();});row.append(star);}
      const count=document.createElement("span");count.textContent=String(feedback[key]||0);row.append(count);el.layer.append(row);
    }
    const notes=addControl("textarea","feedback-notes",[752,519,412,121],feedback.notes);notes.placeholder="Add notes (optional)...";notes.addEventListener("input",()=>{feedback.notes=notes.value;persist();});
    const submit=document.createElement("button");submit.type="button";submit.className="feedback-submit";submit.textContent="Submit";position(submit,[1067,666,98,49]);submit.addEventListener("click",()=>{feedback.notes=notes.value.trim();if(!feedback.notes&&!rows.some(([key])=>feedback[key]>=1&&feedback[key]<=5)){state.hint=true;setFeedback("Add a viewing rating or a note before submitting.");return;}feedback.completed=true;persist();next();});el.layer.append(submit);
    notes.setAttribute("aria-label","Viewing feedback notes");notes.setAttribute("aria-description","Optional");
    notes.addEventListener("input",()=>{notes.classList.remove("invalid","hint-active");setFeedback("");});
    if(state.hint&&!feedback.notes.trim()&&!rows.some(([key])=>feedback[key]>=1&&feedback[key]<=5))el.layer.querySelector(".feedback-stars")?.classList.add("hint-active");
  }

  function renderOfferForm(){
    const o=state.offer;
    if(!o.date)o.date=SIMULATION_OFFER_DATE;
    const viewingLabel=`15 Oct 2026, 4:00 PM · ${TARGET_LISTING}`;
    const viewing=addControl("select","offer-viewing",[624,198,216,48],o.viewing,[viewingLabel]);
    const date=addControl("input","offer-date",[852,198,216,48],o.date);date.type="date";
    const price=addControl("input","offer-price",[1080,198,216,48],o.price);price.inputMode="numeric";
    const region=addControl("select","offer-region",[624,291,329,48],o.region,["United Arab Emirates","Saudi Arabia","Qatar"]);
    const city=addControl("select","offer-city",[966,291,330,48],o.city,["Dubai","Abu Dhabi","Sharjah"]);
    const district=addControl("select","offer-district",[624,385,216,48],o.district,["Downtown Dubai","Dubai Marina","Business Bay"]);
    const subDistrict=addControl("select","offer-subdistrict",[852,385,216,48],o.subDistrict,["Imperial Avenue","Opera District","Old Town"]);
    const building=addControl("select","offer-building",[1080,385,216,48],o.building,["Imperial Avenue","Burj Khalifa","Address Downtown"]);
    const buildingNo=addControl("select","offer-building-no",[624,479,329,48],o.buildingNo,["1","2","3"]);
    const tower=addControl("select","offer-tower",[966,479,330,48],o.tower,["Tower A","Tower B","North Tower"]);
    const category=addControl("select","offer-category",[624,572,329,48],o.category,["Apartment","Villa","Townhouse","Penthouse"]);
    const listingType=addControl("select","offer-listing-type",[966,572,330,48],o.listingType,["Sales","Rent"]);
    const bedrooms=addControl("select","offer-bedrooms",[624,666,216,48],o.bedrooms,["Studio","1","2","3","4","5+"]);
    const bathrooms=addControl("select","offer-bathrooms",[852,666,216,48],o.bathrooms,["1","2","3","4","5+"]);
    const unit=addControl("input","offer-unit",[1080,666,216,48],o.unit);unit.placeholder="Enter unit / plot no";
    const fields=[[date,"date"],[price,"price"],[region,"region"],[city,"city"],[district,"district"],[subDistrict,"subDistrict"],[building,"building"],[buildingNo,"buildingNo"],[tower,"tower"],[category,"category"],[listingType,"listingType"],[bedrooms,"bedrooms"],[bathrooms,"bathrooms"],[unit,"unit"]];
    for(const [node,key] of fields)node.addEventListener(node.tagName==="INPUT"?"input":"change",()=>{o[key]=node.value;persist();});
    viewing.addEventListener("change",()=>{o.viewing=viewing.value;if(o.viewing===viewingLabel){Object.assign(o,{price:"4200000",region:"United Arab Emirates",city:"Dubai",district:"Downtown Dubai",subDistrict:"Imperial Avenue",building:"Imperial Avenue",category:"Apartment",listingType:"Sales",bedrooms:"2",bathrooms:"3",unit:"712"});persist();render();}else persist();});
    const save=document.createElement("button");save.type="button";save.className="native-button";save.textContent="Save";position(save,[1216,742,80,38]);save.addEventListener("click",()=>{o.viewing=viewing.value;o.date=date.value;o.price=price.value;for(const [node,key] of fields)o[key]=node.value;const amount=Number(String(o.price).replace(/\D/g,""));const listingDetailsOk=o.region==="United Arab Emirates"&&o.city==="Dubai"&&o.district==="Downtown Dubai"&&o.subDistrict==="Imperial Avenue"&&o.building==="Imperial Avenue"&&o.category==="Apartment"&&o.listingType==="Sales"&&o.bedrooms==="2"&&o.bathrooms==="3"&&o.unit==="712";if(!state.viewingFeedback.completed){state.hint=true;setFeedback("Complete and submit the required viewing feedback before recording an offer.");return;}if(!(o.viewing===viewingLabel&&o.date===SIMULATION_OFFER_DATE&&amount===4000000&&listingDetailsOk)){state.hint=true;setFeedback("Select the MPS-46214 viewing, keep its linked property details, use 16 October 2026 (today in the simulation) and change the offer to AED 4,000,000.");return;}state.completed=true;scorm.complete();next();});el.layer.append(save);
  }

  function renderComplete(){
    const overlay=document.createElement("div");overlay.className="complete-overlay";const card=document.createElement("section");card.className="overlay-card";
    card.innerHTML=`<p class="eyebrow">PASSED · SCORE 100%</p><h2>Client journey complete</h2><p>You created and priced Omar's listing, completed its owner, documents, amenities, view, description and media, requested publication, responded to Saira's Bayut enquiry, completed the required activities, qualified the lead, presented an option, arranged a viewing, submitted the required viewing feedback and recorded the offer.</p><div class="case-grid"><div><small>Seller listing</small><strong>${TARGET_LISTING}</strong></div><div><small>Lead source</small><strong>Bayut.com</strong></div><div><small>Viewing feedback</small><strong>Completed within 1 day</strong></div><div><small>Offer</small><strong>AED 4,000,000</strong></div><div><small>Result</small><strong>Passed · 100%</strong></div></div>`;
    const again=document.createElement("button");again.type="button";again.className="primary";again.textContent="Restart assessment";again.addEventListener("click",restart);card.append(again);overlay.append(card);el.layer.append(overlay);
  }

  function renderCase(){
    const i=state.scene,reached=id=>i>=scenes.findIndex(s=>s.id===id);
    el.caseContent.innerHTML=`
      <section class="case-section"><h3>Seller and property</h3><dl><div><dt>Seller</dt><dd>Omar Al Mansoori</dd></div><div><dt>Property for</dt><dd>Sale · Residential</dd></div><div><dt>Location</dt><dd>Imperial Avenue, Downtown Dubai</dd></div><div><dt>Unit</dt><dd>712</dd></div><div><dt>Category</dt><dd>Apartment</dd></div><div><dt>Bedrooms</dt><dd>2</dd></div><div><dt>BUA</dt><dd>1,250 sq ft</dd></div><div><dt>Bathrooms</dt><dd>3</dd></div><div><dt>Furnishing</dt><dd>Unfurnished</dd></div><div><dt>Listing type</dt><dd>Live</dd></div><div><dt>Listing source</dt><dd>Internal Listing</dd></div><div><dt>Property status</dt><dd>Completed Secondary</dd></div><div><dt>Price</dt><dd>AED 4,200,000</dd></div><div><dt>Original price</dt><dd>AED 4,200,000</dd></div></dl></section>
      <section class="case-section"><h3>Listing preparation · practice details</h3><p>Use these practice details to create Omar’s contact and complete the listing.</p><dl><div><dt>New owner contact</dt><dd>Omar Al Mansoori · +971 50 555 0172 · omar.almansoori@example.test</dd></div><div><dt>Documents</dt><dd>Omar-title-deed.pdf → Title Deed / SPA; Omar-owner-ID.pdf → Owner ID / Passport</dd></div><div><dt>Amenities (five)</dt><dd>Balcony; Built in wardrobes; Central A/C; Security; Shared pool</dd></div><div><dt>View</dt><dd>Burj Khalifa</dd></div><div><dt>Title</dt><dd>Enter any title of your choice.</dd></div><div><dt>Description</dt><dd>Enter any description of your choice. Both fields must contain text, then select Save to draft.</dd></div><div><dt>Gallery</dt><dd>Unit-712-photo-set (3 JPG files) (practice photo set)</dd></div><div><dt>Floor plans</dt><dd>Unit-712-floor-plan.png</dd></div></dl></section>
      ${reached("lead-arrival")?`<section class="case-section"><h3>Buyer lead</h3><dl><div><dt>Name</dt><dd>Saira Khan</dd></div><div><dt>Mobile</dt><dd>+971 50 555 0147</dd></div><div><dt>Email</dt><dd>saira.khan@example.test</dd></div><div><dt>Source</dt><dd>Bayut.com</dd></div><div><dt>Customer type</dt><dd>Buyer</dd></div><div><dt>Linked listing</dt><dd>${TARGET_LISTING}</dd></div></dl></section>`:""}
      ${reached("qualification-brief")?`<section class="case-section"><h3>Qualification details</h3><dl><div><dt>Budget</dt><dd>AED 3M–5M</dd></div><div><dt>Bedrooms</dt><dd>2–3</dd></div><div><dt>Timeline</dt><dd>2 months</dd></div><div><dt>Level of interest</dt><dd>Warm</dd></div><div><dt>Criteria</dt><dd>Sale · Downtown Dubai</dd></div><div><dt>Maximum price</dt><dd>AED 5,000,000</dd></div></dl></section>`:""}
      ${reached("add-viewing")?`<section class="case-section"><h3>Viewing</h3><dl><div><dt>Date</dt><dd>15 October 2026</dd></div><div><dt>Time</dt><dd>4:00 PM</dd></div><div><dt>Listing</dt><dd>${TARGET_LISTING}</dd></div><div><dt>Type</dt><dd>Viewing</dd></div></dl></section>`:""}
      ${reached("feedback-brief")?`<section class="case-section"><h3>Viewing feedback</h3><p>Saira liked the unit's layout, natural light and overall condition. She felt it could suit her needs, but would prefer a similar unit on a lower floor. She remains interested and would like to discuss making an offer.</p></section>`:""}
      ${reached("add-offer")?`<section class="case-section"><h3>Offer</h3><dl><div><dt>Date</dt><dd>16 October 2026</dd></div><div><dt>Amount</dt><dd>AED 4,000,000</dd></div><div><dt>Against</dt><dd>${TARGET_LISTING}</dd></div></dl></section>`:""}
      <div class="policy-note"><strong>Policy reminder:</strong> comments do not count as activity. Record the call outcome and create the required follow-up in MCRM. Viewing feedback must be recorded within one day and is required before the offer stage.</div>`;
  }

  function render(){
    document.querySelector(".interface-tour")?.remove();document.querySelectorAll(".tour-highlight").forEach(node=>node.classList.remove("tour-highlight"));
    const s=scenes[state.scene];el.layer.replaceChildren();el.screen.src=`assets/images/${s.screen}`;el.screen.alt=`${s.title} - MCRM screenshot`;el.canvas.classList.toggle("tall",Boolean(s.tall));el.canvas.classList.toggle("listing-detail-canvas",Boolean(s.detail));
    el.stepLabel.textContent=s.kind==="complete"?"Assessment complete":state.scene===0?"Assessment briefing":`Stage ${state.scene} of ${scenes.length-2}`;
    el.stepTitle.textContent=s.title;el.instruction.textContent=s.instruction;el.clock.textContent=s.time;el.progressText.textContent=state.completed?"Passed · 100%":state.scene===0?"Ready to begin":`In progress · ${Math.round((state.scene/(scenes.length-1))*100)}%`;el.progressFill.style.width=`${(state.scene/(scenes.length-1))*100}%`;
    el.hint.hidden=s.kind==="intro"||s.kind==="phase"||s.kind==="complete";el.hint.textContent=state.hint?"Hide hint":"Show hint";setFeedback(feedbackText);
    if(s.kind==="listingDetailEdit"||s.kind==="listingDetailTask")renderListingDetail(s);else if(s.kind==="intro")renderIntro();else if(s.kind==="phase")renderPhase(s);else if(s.kind==="hotspot")makeHotspot(s);else if(s.kind==="listingForm")renderListingForm();else if(s.kind==="listingPrice")renderListingPrice();else if(s.kind==="leadForm")renderLeadForm();else if(s.kind==="contact")renderContact(s);else if(s.kind==="followupMenu")renderFollowupMenu();else if(s.kind==="followupForm")renderFollowupForm();else if(s.kind==="completeFollowup")renderCompleteFollowup(s);else if(s.kind==="qualifyForm")renderQualify();else if(s.kind==="qualifyJourney")renderQualificationJourney();else if(s.kind==="filters")renderFilters();else if(s.kind==="copy")renderCopy();else if(s.kind==="leadTarget")renderLeadTarget();else if(s.kind==="optionModal")renderOptionModal();else if(s.kind==="viewingForm")renderViewingForm();else if(s.kind==="feedbackTarget")renderFeedbackTarget();else if(s.kind==="feedbackForm")renderFeedbackForm();else if(s.kind==="offerForm")renderOfferForm();else if(s.kind==="complete")renderComplete();
    if(["call","no-answer","followup-plus","followup-type","complete-followup","contacted"].includes(s.id))renderLeadContextPatches();
    if(s.detail)renderListingSidebar();
    renderCase();
  }

  function restart(){state=initialState();filterScrollTop=0;filterBedsOpen=false;feedbackText="";try{localStorage.removeItem("mcrm-final-assessment");}catch(_){}persist();render();}
  el.hint.addEventListener("click",()=>{state.hint=!state.hint;feedbackText=state.hint?"Hint: the next required control is highlighted.":"";render();});
  el.restart.addEventListener("click",restart);
  el.fullscreen.addEventListener("click",async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(_){setFeedback("Fullscreen is not available in this browser window.");}});
  document.addEventListener("fullscreenchange",()=>{el.fullscreen.textContent=document.fullscreenElement?"Exit fullscreen":"Fullscreen";});
  el.caseButton.addEventListener("click",()=>{renderCase();el.drawer.hidden=false;});el.closeCase.addEventListener("click",()=>el.drawer.hidden=true);el.drawerScrim.addEventListener("click",()=>el.drawer.hidden=true);
  el.layer.addEventListener("click",e=>{if(e.target===el.layer)setFeedback("That is not the current target. Try again or use Show hint.");});
  window.addEventListener("beforeunload",()=>{persist();scorm.finish();});
  render();
})();
