(function () {
  const COUNTRIES = [
    { name: "Pakistan", lon: 69.3, lat: 30.4 },
    { name: "Nepal", lon: 84.1, lat: 28.4 },
    { name: "India", lon: 78.9, lat: 22.6 },
    { name: "Uzbekistan", lon: 64.6, lat: 41.4 },
    { name: "Kyrgyzstan", lon: 74.8, lat: 41.2 },
    { name: "Turkmenistan", lon: 59.6, lat: 39.0 },
    { name: "Philippines", lon: 121.8, lat: 12.9 },
    { name: "Indonesia", lon: 113.9, lat: -1.5 },
    { name: "Russia", lon: 50.0, lat: 55.5 },
    { name: "Mali", lon: -4.0, lat: 17.5 },
    { name: "Senegal", lon: -14.5, lat: 14.5 },
    { name: "Cameroon", lon: 12.4, lat: 6.0 }
  ];
  const TURKEY = { name: "Türkiye", lon: 35.2, lat: 39.0 };
  const TOPO = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

  class SourceMap extends HTMLElement {
    connectedCallback() {
      if (this._started) return;
      this._started = true;
      this.style.display = "block";
      this.style.position = "relative";
      this._waitForLibs();
    }
    _waitForLibs(tries) {
      tries = tries || 0;
      if (window.d3 && window.topojson) return this._render();
      if (tries > 200) return;
      setTimeout(() => this._waitForLibs(tries + 1), 60);
    }
    async _render() {
      const d3 = window.d3, topojson = window.topojson;
      const W = this.clientWidth || 640;
      const H = Math.round(W * 0.62);
      const svg = d3.select(this).append("svg")
        .attr("viewBox", `0 0 ${W} ${H}`)
        .attr("width", "100%")
        .style("display", "block")
        .style("overflow", "hidden");

      let topo;
      try { topo = await d3.json(TOPO); } catch (e) { return; }
      const land = topojson.feature(topo, topo.objects.countries);

      const pts = COUNTRIES.concat([TURKEY]);
      const bbox = {
        type: "MultiPoint",
        coordinates: pts.map((p) => [p.lon, p.lat])
      };
      const projection = d3.geoMercator().fitExtent([[16, 18], [W - 16, H - 18]], bbox);
      const path = d3.geoPath(projection);

      const highlight = new Set(["Pakistan", "Nepal", "India", "Uzbekistan", "Kyrgyzstan", "Turkmenistan", "Philippines", "Indonesia", "Russia", "Mali", "Senegal", "Cameroon"]);

      svg.append("g").selectAll("path").data(land.features).join("path")
        .attr("d", path)
        .attr("fill", (d) => (d.properties && d.properties.name === "Turkey") ? "#1899D5" : (highlight.has(d.properties && d.properties.name) ? "#cfe6f4" : "#eaf1f6"))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.7);

      const tk = projection([TURKEY.lon, TURKEY.lat]);

      const arcs = svg.append("g").selectAll("path").data(COUNTRIES).join("path")
        .attr("d", (d) => path({ type: "LineString", coordinates: [[d.lon, d.lat], [TURKEY.lon, TURKEY.lat]] }))
        .attr("fill", "none")
        .attr("stroke", "#1899D5")
        .attr("stroke-width", 1.4)
        .attr("stroke-linecap", "round")
        .attr("opacity", 0.55);

      arcs.each(function (d, i) {
        const len = this.getTotalLength();
        d3.select(this)
          .attr("stroke-dasharray", `${len} ${len}`)
          .attr("stroke-dashoffset", len)
          .transition().delay(220 + i * 110).duration(900).ease(d3.easeCubicOut)
          .attr("stroke-dashoffset", 0);
      });

      const tip = document.createElement("div");
      Object.assign(tip.style, {
        position: "absolute", pointerEvents: "none", opacity: "0",
        background: "#0f2438", color: "#fff", fontSize: "12.5px", fontWeight: "700",
        padding: "5px 10px", borderRadius: "7px", whiteSpace: "nowrap",
        transform: "translate(-50%, -140%)", transition: "opacity .15s ease", zIndex: "3"
      });
      this.appendChild(tip);

      const dots = svg.append("g").selectAll("g").data(COUNTRIES).join("g")
        .attr("transform", (d) => `translate(${projection([d.lon, d.lat]).join(",")})`)
        .style("cursor", "default");

      dots.append("circle").attr("r", 4.5).attr("fill", "#1073a8").attr("stroke", "#ffffff").attr("stroke-width", 1.6);
      dots.append("circle").attr("r", 4.5).attr("fill", "none").attr("stroke", "#1899D5").attr("stroke-width", 1.4)
        .each(function (d, i) {
          const c = d3.select(this);
          const loop = () => {
            c.attr("r", 4.5).attr("opacity", 0.75)
              .transition().duration(1900).ease(d3.easeCubicOut)
              .attr("r", 15).attr("opacity", 0)
              .on("end", loop);
          };
          setTimeout(loop, 700 + i * 260);
        });
      dots.append("circle").attr("r", 14).attr("fill", "transparent")
        .on("mouseenter", (ev, d) => {
          const r = this.getBoundingClientRect();
          const b = ev.currentTarget.getBoundingClientRect();
          tip.textContent = d.name;
          tip.style.left = (b.left - r.left + b.width / 2) + "px";
          tip.style.top = (b.top - r.top) + "px";
          tip.style.opacity = "1";
        })
        .on("mouseleave", () => { tip.style.opacity = "0"; });

      const tg = svg.append("g").attr("transform", `translate(${tk[0]},${tk[1]})`);
      tg.append("circle").attr("r", 7).attr("fill", "#16a34a").attr("stroke", "#ffffff").attr("stroke-width", 2.2);
      tg.append("text").text("Türkiye")
        .attr("y", -14).attr("text-anchor", "middle")
        .attr("font-size", 13).attr("font-weight", 800).attr("fill", "#0f5c2e")
        .attr("stroke", "#ffffff").attr("stroke-width", 3.5).attr("paint-order", "stroke");
    }
  }
  if (!customElements.get("source-map")) customElements.define("source-map", SourceMap);
})();
