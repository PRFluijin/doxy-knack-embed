(() => {
  // node_modules/doxy.me/dist/index.esm.js
  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  var SDK_VERSION = "1.2.1";
  var DEFAULT_BASE_URL = "https://doxy.me";
  function embedDoxyMe(container, options) {
    try {
      const containerElement = typeof container === "string" ? document.querySelector(container) : container;
      if (!containerElement) {
        throw new Error(`Container element not found: ${typeof container === "string" ? container : "provided element"}`);
      }
      if (!(containerElement instanceof HTMLElement)) {
        throw new Error("Container must be an HTMLElement");
      }
      if (!options.url) {
        throw new Error("URL is required");
      }
      let iframeUrl = options.url;
      if (!iframeUrl.startsWith("http://") && !iframeUrl.startsWith("https://") && !iframeUrl.startsWith("/")) {
        iframeUrl = `https://${iframeUrl}`;
      }
      const params = new URLSearchParams();
      params.set("utm_source", "embed-sdk");
      params.set("sdk_version", SDK_VERSION);
      if (options.trackingParams) {
        for (const [key, value] of Object.entries(options.trackingParams)) {
          params.set(key, value);
        }
      }
      const separator = iframeUrl.includes("?") ? "&" : "?";
      iframeUrl = `${iframeUrl}${separator}${params.toString()}`;
      const iframe = document.createElement("iframe");
      iframe.src = iframeUrl;
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      const widthStr = options.width === void 0 ? "100%" : typeof options.width === "number" ? `${options.width}px` : options.width.trim();
      if (widthStr.endsWith("%")) {
        iframe.removeAttribute("width");
        iframe.style.width = widthStr;
      } else {
        iframe.style.width = "";
        iframe.width = widthStr;
      }
      const heightStr = options.height === void 0 ? "600px" : typeof options.height === "number" ? `${options.height}px` : options.height.trim();
      if (heightStr.endsWith("%")) {
        iframe.removeAttribute("height");
        iframe.style.height = heightStr;
      } else {
        iframe.style.height = "";
        iframe.height = heightStr;
      }
      iframe.allow = options.allow || "camera; microphone; fullscreen";
      if (options.sandbox) {
        iframe.setAttribute("sandbox", options.sandbox);
      }
      if (options.className) {
        iframe.className = options.className;
      }
      if (options.id) {
        iframe.id = options.id;
      }
      if (options.style) {
        Object.assign(iframe.style, options.style);
      }
      iframe.style.border = "none";
      iframe.style.display = "block";
      if (options.onLoad) {
        iframe.addEventListener("load", options.onLoad);
      }
      if (options.onError) {
        iframe.addEventListener("error", options.onError);
      }
      containerElement.appendChild(iframe);
      return {
        iframe,
        destroy: () => {
          try {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          } catch (error) {
            console.error("Error destroying doxy.me iframe:", error);
          }
        }
      };
    } catch (error) {
      console.error("Error embedding doxy.me:", error);
      throw error;
    }
  }
  function patientRoomPath(version, roomSlug) {
    return version === "v2" ? `/v2/check-in/${roomSlug}` : `/${roomSlug}`;
  }
  function embedPatientRoom(container, roomSlug, options) {
    if (!roomSlug) {
      throw new Error("Room slug is required for patient room");
    }
    const _a = options !== null && options !== void 0 ? options : {}, { version = "v1", baseUrl = DEFAULT_BASE_URL, username, autoCheckIn, passcode, patientId, trackingParams } = _a, rest = __rest(_a, ["version", "baseUrl", "username", "autoCheckIn", "passcode", "patientId", "trackingParams"]);
    const mergedTracking = {};
    if (username)
      mergedTracking["username"] = username;
    if (autoCheckIn)
      mergedTracking["autocheckin"] = "true";
    if (passcode)
      mergedTracking["passcode"] = passcode;
    if (patientId)
      mergedTracking["pid"] = patientId;
    if (trackingParams)
      Object.assign(mergedTracking, trackingParams);
    return embedDoxyMe(container, Object.assign(Object.assign({}, rest), { url: `${baseUrl}${patientRoomPath(version, roomSlug)}`, trackingParams: mergedTracking }));
  }

  // knack-entry.js
  window.embedDoxyPatientRoom = function(roomSlug) {
    const container = document.getElementById("doxy-container");
    if (!container) {
      console.error("Doxy.me container was not found.");
      return;
    }
    return embedPatientRoom(container, roomSlug, {
      width: "100%",
      height: "800px"
    });
  };
})();
