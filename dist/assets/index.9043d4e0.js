var e=Object.defineProperty,t=Object.defineProperties,n=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,i=(t,n,a)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[n]=a,l=(e,t)=>{for(var n in t||(t={}))r.call(t,n)&&i(e,n,t[n]);if(a)for(var n of a(t))o.call(t,n)&&i(e,n,t[n]);return e};import{r as s,u as c,R as p,a as m,C as u,O as d,E as f,b as v,S as h,B as g,c as y,d as S,N as b,e as O,f as P,g as E,h as x}from"./vendor.c2c5cd48.js";const w=[[0,100,50],[60,100,50],[150,100,50],[240,70,60],[0,0,80]];function M(){const[e,t]=s.exports.useState(0),{hsl:n}=c({hsl:w[e%w.length],config:{tension:50}}),a=n.to(((e,t,n)=>`radial-gradient(hsl(${e}, ${.7*t}%, ${n}%), hsl(${e},${.4*t}%, ${.2*n}%))`));return p.createElement(m.div,{style:{background:a,width:"100%",height:"100%"}},p.createElement(u,{camera:{position:[0,0,2]}},p.createElement(s.exports.Suspense,{fallback:null},p.createElement(d,{autoRotate:!0,enableRotate:!1,enablePan:!1,enableZoom:!1}),p.createElement(B,{step:e,setStep:t}),p.createElement(f,{preset:"warehouse"}))))}function B({step:e,setStep:t}){const[n,a]=s.exports.useState(!1),[r,o]=s.exports.useState(!1),{scale:i}=c({scale:r&&n?.95:1,config:{friction:15,tension:300}});return p.createElement("group",null,p.createElement(v.group,{scale:i,onPointerEnter:()=>a(!0),onPointerOut:()=>a(!1),onClick:()=>t(e+1)},p.createElement(h,{args:[1,64,32]},p.createElement(D,{step:e,roughness:.1}))),p.createElement(g,{args:[100,100,100],onPointerDown:()=>o(!0),onPointerUp:()=>o(!1)},p.createElement("meshBasicMaterial",{side:y,visible:!1})))}function D(e){var i=e,{step:m}=i,u=((e,t)=>{var n={};for(var i in e)r.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&a)for(var i of a(e))t.indexOf(i)<0&&o.call(e,i)&&(n[i]=e[i]);return n})(i,["step"]);const d=S("noise.jpg"),f=S("noise3D.jpg");d.minFilter=f.minFilter=b,f.wrapS=f.wrapT=O;const[v]=s.exports.useState((()=>({time:{value:0},colorA:{value:new P(0,0,0)},colorB:{value:new P(1,0,0)},heightMap:{value:d},displacementMap:{value:f},iterations:{value:48},depth:{value:.6},smoothing:{value:.2},displacement:{value:.1}}))),{timeOffset:h}=c({hsl:w[m%w.length],timeOffset:.2*m,config:{tension:50},onChange:({value:{hsl:e}})=>{const[t,n,a]=e;v.colorB.value.setHSL(t/360,n/100,a/100)}});E((({clock:e})=>{v.time.value=h.get()+.05*e.elapsedTime}));const g=e=>{e.uniforms=l(l({},e.uniforms),v),e.vertexShader="\n      varying vec3 v_pos;\n      varying vec3 v_dir;\n    "+e.vertexShader,e.vertexShader=e.vertexShader.replace(/void main\(\) {/,(e=>e+"\n        v_dir = position - cameraPosition; // Points from camera to vertex\n        v_pos = position;\n        ")),e.fragmentShader="\n      #define FLIP vec2(1., -1.)\n      \n      uniform vec3 colorA;\n      uniform vec3 colorB;\n      uniform sampler2D heightMap;\n      uniform sampler2D displacementMap;\n      uniform int iterations;\n      uniform float depth;\n      uniform float smoothing;\n      uniform float displacement;\n      uniform float time;\n      \n      varying vec3 v_pos;\n      varying vec3 v_dir;\n    "+e.fragmentShader,e.fragmentShader=e.fragmentShader.replace(/void main\(\) {/,(e=>"\n       \t/**\n         * @param p - Point to displace\n         * @param strength - How much the map can displace the point\n         * @returns Point with scrolling displacement applied\n         */\n        vec3 displacePoint(vec3 p, float strength) {\n        \tvec2 uv = equirectUv(normalize(p));\n          vec2 scroll = vec2(time, 0.);\n          vec3 displacementA = texture(displacementMap, uv + scroll).rgb; // Upright\n\t\t\t\t\tvec3 displacementB = texture(displacementMap, uv * FLIP - scroll).rgb; // Upside down\n          \n          // Center the range to [-0.5, 0.5], note the range of their sum is [-1, 1]\n          displacementA -= 0.5;\n          displacementB -= 0.5;\n          \n          return p + strength * (displacementA + displacementB);\n        }\n        \n\t\t\t\t/**\n          * @param rayOrigin - Point on sphere\n          * @param rayDir - Normalized ray direction\n          * @returns Diffuse RGB color\n          */\n        vec3 marchMarble(vec3 rayOrigin, vec3 rayDir) {\n          float perIteration = 1. / float(iterations);\n          vec3 deltaRay = rayDir * perIteration * depth;\n\n          // Start at point of intersection and accumulate volume\n          vec3 p = rayOrigin;\n          float totalVolume = 0.;\n\n          for (int i=0; i<iterations; ++i) {\n            // Read heightmap from spherical direction of displaced ray position\n            vec3 displaced = displacePoint(p, displacement);\n            vec2 uv = equirectUv(normalize(displaced));\n            float heightMapVal = texture(heightMap, uv).r;\n\n            // Take a slice of the heightmap\n            float height = length(p); // 1 at surface, 0 at core, assuming radius = 1\n            float cutoff = 1. - float(i) * perIteration;\n            float slice = smoothstep(cutoff, cutoff + smoothing, heightMapVal);\n\n            // Accumulate the volume and advance the ray forward one step\n            totalVolume += slice * perIteration;\n            p += deltaRay;\n          }\n          return mix(colorA, colorB, totalVolume);\n        }\n      "+e)),e.fragmentShader=e.fragmentShader.replace(/vec4 diffuseColor.*;/,"\n      vec3 rayDir = normalize(v_dir);\n      vec3 rayOrigin = v_pos;\n      \n      vec3 rgb = marchMarble(rayOrigin, rayDir);\n      vec4 diffuseColor = vec4(rgb, 1.);      \n      ")};return p.createElement("meshStandardMaterial",(y=l({},u),t(y,n({onBeforeCompile:g,onUpdate:e=>e.needsUpdate=!0,customProgramCacheKey:()=>g.toString()}))));var y}x.render(p.createElement(p.StrictMode,null,p.createElement(M,null)),document.getElementById("root"));
