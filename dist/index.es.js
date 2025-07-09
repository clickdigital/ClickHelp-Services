import { defineStore as hn } from "pinia";
import { ref as Ge, computed as Fr } from "vue";
const Ed = () => {
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mu = function(n) {
  const e = [];
  let t = 0;
  for (let r = 0; r < n.length; r++) {
    let s = n.charCodeAt(r);
    s < 128 ? e[t++] = s : s < 2048 ? (e[t++] = s >> 6 | 192, e[t++] = s & 63 | 128) : (s & 64512) === 55296 && r + 1 < n.length && (n.charCodeAt(r + 1) & 64512) === 56320 ? (s = 65536 + ((s & 1023) << 10) + (n.charCodeAt(++r) & 1023), e[t++] = s >> 18 | 240, e[t++] = s >> 12 & 63 | 128, e[t++] = s >> 6 & 63 | 128, e[t++] = s & 63 | 128) : (e[t++] = s >> 12 | 224, e[t++] = s >> 6 & 63 | 128, e[t++] = s & 63 | 128);
  }
  return e;
}, Td = function(n) {
  const e = [];
  let t = 0, r = 0;
  for (; t < n.length; ) {
    const s = n[t++];
    if (s < 128)
      e[r++] = String.fromCharCode(s);
    else if (s > 191 && s < 224) {
      const o = n[t++];
      e[r++] = String.fromCharCode((s & 31) << 6 | o & 63);
    } else if (s > 239 && s < 365) {
      const o = n[t++], a = n[t++], u = n[t++], l = ((s & 7) << 18 | (o & 63) << 12 | (a & 63) << 6 | u & 63) - 65536;
      e[r++] = String.fromCharCode(55296 + (l >> 10)), e[r++] = String.fromCharCode(56320 + (l & 1023));
    } else {
      const o = n[t++], a = n[t++];
      e[r++] = String.fromCharCode((s & 15) << 12 | (o & 63) << 6 | a & 63);
    }
  }
  return e.join("");
}, gu = {
  /**
   * Maps bytes to characters.
   */
  byteToCharMap_: null,
  /**
   * Maps characters to bytes.
   */
  charToByteMap_: null,
  /**
   * Maps bytes to websafe characters.
   * @private
   */
  byteToCharMapWebSafe_: null,
  /**
   * Maps websafe characters to bytes.
   * @private
   */
  charToByteMapWebSafe_: null,
  /**
   * Our default alphabet, shared between
   * ENCODED_VALS and ENCODED_VALS_WEBSAFE
   */
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  /**
   * Our default alphabet. Value 64 (=) is special; it means "nothing."
   */
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  /**
   * Our websafe alphabet.
   */
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  /**
   * Whether this browser supports the atob and btoa functions. This extension
   * started at Mozilla but is now implemented by many browsers. We use the
   * ASSUME_* variables to avoid pulling in the full useragent detection library
   * but still allowing the standard per-browser compilations.
   *
   */
  HAS_NATIVE_SUPPORT: typeof atob == "function",
  /**
   * Base64-encode an array of bytes.
   *
   * @param input An array of bytes (numbers with
   *     value in [0, 255]) to encode.
   * @param webSafe Boolean indicating we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeByteArray(n, e) {
    if (!Array.isArray(n))
      throw Error("encodeByteArray takes an array as a parameter");
    this.init_();
    const t = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_, r = [];
    for (let s = 0; s < n.length; s += 3) {
      const o = n[s], a = s + 1 < n.length, u = a ? n[s + 1] : 0, l = s + 2 < n.length, d = l ? n[s + 2] : 0, p = o >> 2, y = (o & 3) << 4 | u >> 4;
      let w = (u & 15) << 2 | d >> 6, P = d & 63;
      l || (P = 64, a || (w = 64)), r.push(t[p], t[y], t[w], t[P]);
    }
    return r.join("");
  },
  /**
   * Base64-encode a string.
   *
   * @param input A string to encode.
   * @param webSafe If true, we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeString(n, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? btoa(n) : this.encodeByteArray(mu(n), e);
  },
  /**
   * Base64-decode a string.
   *
   * @param input to decode.
   * @param webSafe True if we should use the
   *     alternative alphabet.
   * @return string representing the decoded value.
   */
  decodeString(n, e) {
    return this.HAS_NATIVE_SUPPORT && !e ? atob(n) : Td(this.decodeStringToByteArray(n, e));
  },
  /**
   * Base64-decode a string.
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * @param input Input to decode.
   * @param webSafe True if we should use the web-safe alphabet.
   * @return bytes representing the decoded value.
   */
  decodeStringToByteArray(n, e) {
    this.init_();
    const t = e ? this.charToByteMapWebSafe_ : this.charToByteMap_, r = [];
    for (let s = 0; s < n.length; ) {
      const o = t[n.charAt(s++)], u = s < n.length ? t[n.charAt(s)] : 0;
      ++s;
      const d = s < n.length ? t[n.charAt(s)] : 64;
      ++s;
      const y = s < n.length ? t[n.charAt(s)] : 64;
      if (++s, o == null || u == null || d == null || y == null)
        throw new Id();
      const w = o << 2 | u >> 4;
      if (r.push(w), d !== 64) {
        const P = u << 4 & 240 | d >> 2;
        if (r.push(P), y !== 64) {
          const k = d << 6 & 192 | y;
          r.push(k);
        }
      }
    }
    return r;
  },
  /**
   * Lazy static initialization function. Called before
   * accessing any of the static map variables.
   * @private
   */
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
      for (let n = 0; n < this.ENCODED_VALS.length; n++)
        this.byteToCharMap_[n] = this.ENCODED_VALS.charAt(n), this.charToByteMap_[this.byteToCharMap_[n]] = n, this.byteToCharMapWebSafe_[n] = this.ENCODED_VALS_WEBSAFE.charAt(n), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]] = n, n >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)] = n, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)] = n);
    }
  }
};
class Id extends Error {
  constructor() {
    super(...arguments), this.name = "DecodeBase64StringError";
  }
}
const wd = function(n) {
  const e = mu(n);
  return gu.encodeByteArray(e, !0);
}, Jr = function(n) {
  return wd(n).replace(/\./g, "");
}, _u = function(n) {
  try {
    return gu.decodeString(n, !0);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ad() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unable to locate global object.");
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Rd = () => Ad().__FIREBASE_DEFAULTS__, Sd = () => {
  if (typeof process > "u" || typeof process.env > "u")
    return;
  const n = process.env.__FIREBASE_DEFAULTS__;
  if (n)
    return JSON.parse(n);
}, Pd = () => {
  if (typeof document > "u")
    return;
  let n;
  try {
    n = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch {
    return;
  }
  const e = n && _u(n[1]);
  return e && JSON.parse(e);
}, _s = () => {
  try {
    return Ed() || Rd() || Sd() || Pd();
  } catch (n) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);
    return;
  }
}, yu = (n) => {
  var e, t;
  return (t = (e = _s()) === null || e === void 0 ? void 0 : e.emulatorHosts) === null || t === void 0 ? void 0 : t[n];
}, Cd = (n) => {
  const e = yu(n);
  if (!e)
    return;
  const t = e.lastIndexOf(":");
  if (t <= 0 || t + 1 === e.length)
    throw new Error(`Invalid host ${e} with no separate hostname and port!`);
  const r = parseInt(e.substring(t + 1), 10);
  return e[0] === "[" ? [e.substring(1, t - 1), r] : [e.substring(0, t), r];
}, vu = () => {
  var n;
  return (n = _s()) === null || n === void 0 ? void 0 : n.config;
}, Eu = (n) => {
  var e;
  return (e = _s()) === null || e === void 0 ? void 0 : e[`_${n}`];
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class bd {
  constructor() {
    this.reject = () => {
    }, this.resolve = () => {
    }, this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
  /**
   * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
   * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
   * and returns a node-style callback which will resolve or reject the Deferred's promise.
   */
  wrapCallback(e) {
    return (t, r) => {
      t ? this.reject(t) : this.resolve(r), typeof e == "function" && (this.promise.catch(() => {
      }), e.length === 1 ? e(t) : e(t, r));
    };
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function kd(n, e) {
  if (n.uid)
    throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
  const t = {
    alg: "none",
    type: "JWT"
  }, r = e || "demo-project", s = n.iat || 0, o = n.sub || n.user_id;
  if (!o)
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  const a = Object.assign({
    // Set all required fields to decent defaults
    iss: `https://securetoken.google.com/${r}`,
    aud: r,
    iat: s,
    exp: s + 3600,
    auth_time: s,
    sub: o,
    user_id: o,
    firebase: {
      sign_in_provider: "custom",
      identities: {}
    }
  }, n);
  return [
    Jr(JSON.stringify(t)),
    Jr(JSON.stringify(a)),
    ""
  ].join(".");
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ee() {
  return typeof navigator < "u" && typeof navigator.userAgent == "string" ? navigator.userAgent : "";
}
function Vd() {
  return typeof window < "u" && // @ts-ignore Setting up an broadly applicable index signature for Window
  // just to deal with this case would probably be a bad idea.
  !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ee());
}
function Dd() {
  var n;
  const e = (n = _s()) === null || n === void 0 ? void 0 : n.forceEnvironment;
  if (e === "node")
    return !0;
  if (e === "browser")
    return !1;
  try {
    return Object.prototype.toString.call(global.process) === "[object process]";
  } catch {
    return !1;
  }
}
function Nd() {
  return typeof navigator < "u" && navigator.userAgent === "Cloudflare-Workers";
}
function Od() {
  const n = typeof chrome == "object" ? chrome.runtime : typeof browser == "object" ? browser.runtime : void 0;
  return typeof n == "object" && n.id !== void 0;
}
function Ld() {
  return typeof navigator == "object" && navigator.product === "ReactNative";
}
function Md() {
  const n = Ee();
  return n.indexOf("MSIE ") >= 0 || n.indexOf("Trident/") >= 0;
}
function xd() {
  return !Dd() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
}
function Ud() {
  try {
    return typeof indexedDB == "object";
  } catch {
    return !1;
  }
}
function Fd() {
  return new Promise((n, e) => {
    try {
      let t = !0;
      const r = "validate-browser-context-for-indexeddb-analytics-module", s = self.indexedDB.open(r);
      s.onsuccess = () => {
        s.result.close(), t || self.indexedDB.deleteDatabase(r), n(!0);
      }, s.onupgradeneeded = () => {
        t = !1;
      }, s.onerror = () => {
        var o;
        e(((o = s.error) === null || o === void 0 ? void 0 : o.message) || "");
      };
    } catch (t) {
      e(t);
    }
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Bd = "FirebaseError";
class et extends Error {
  constructor(e, t, r) {
    super(t), this.code = e, this.customData = r, this.name = Bd, Object.setPrototypeOf(this, et.prototype), Error.captureStackTrace && Error.captureStackTrace(this, rr.prototype.create);
  }
}
class rr {
  constructor(e, t, r) {
    this.service = e, this.serviceName = t, this.errors = r;
  }
  create(e, ...t) {
    const r = t[0] || {}, s = `${this.service}/${e}`, o = this.errors[e], a = o ? jd(o, r) : "Error", u = `${this.serviceName}: ${a} (${s}).`;
    return new et(s, u, r);
  }
}
function jd(n, e) {
  return n.replace(qd, (t, r) => {
    const s = e[r];
    return s != null ? String(s) : `<${r}?>`;
  });
}
const qd = /\{\$([^}]+)}/g;
function $d(n) {
  for (const e in n)
    if (Object.prototype.hasOwnProperty.call(n, e))
      return !1;
  return !0;
}
function Nt(n, e) {
  if (n === e)
    return !0;
  const t = Object.keys(n), r = Object.keys(e);
  for (const s of t) {
    if (!r.includes(s))
      return !1;
    const o = n[s], a = e[s];
    if (qa(o) && qa(a)) {
      if (!Nt(o, a))
        return !1;
    } else if (o !== a)
      return !1;
  }
  for (const s of r)
    if (!t.includes(s))
      return !1;
  return !0;
}
function qa(n) {
  return n !== null && typeof n == "object";
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function sr(n) {
  const e = [];
  for (const [t, r] of Object.entries(n))
    Array.isArray(r) ? r.forEach((s) => {
      e.push(encodeURIComponent(t) + "=" + encodeURIComponent(s));
    }) : e.push(encodeURIComponent(t) + "=" + encodeURIComponent(r));
  return e.length ? "&" + e.join("&") : "";
}
function Mn(n) {
  const e = {};
  return n.replace(/^\?/, "").split("&").forEach((r) => {
    if (r) {
      const [s, o] = r.split("=");
      e[decodeURIComponent(s)] = decodeURIComponent(o);
    }
  }), e;
}
function xn(n) {
  const e = n.indexOf("?");
  if (!e)
    return "";
  const t = n.indexOf("#", e);
  return n.substring(e, t > 0 ? t : void 0);
}
function zd(n, e) {
  const t = new Hd(n, e);
  return t.subscribe.bind(t);
}
class Hd {
  /**
   * @param executor Function which can make calls to a single Observer
   *     as a proxy.
   * @param onNoObservers Callback when count of Observers goes to zero.
   */
  constructor(e, t) {
    this.observers = [], this.unsubscribes = [], this.observerCount = 0, this.task = Promise.resolve(), this.finalized = !1, this.onNoObservers = t, this.task.then(() => {
      e(this);
    }).catch((r) => {
      this.error(r);
    });
  }
  next(e) {
    this.forEachObserver((t) => {
      t.next(e);
    });
  }
  error(e) {
    this.forEachObserver((t) => {
      t.error(e);
    }), this.close(e);
  }
  complete() {
    this.forEachObserver((e) => {
      e.complete();
    }), this.close();
  }
  /**
   * Subscribe function that can be used to add an Observer to the fan-out list.
   *
   * - We require that no event is sent to a subscriber synchronously to their
   *   call to subscribe().
   */
  subscribe(e, t, r) {
    let s;
    if (e === void 0 && t === void 0 && r === void 0)
      throw new Error("Missing Observer.");
    Wd(e, [
      "next",
      "error",
      "complete"
    ]) ? s = e : s = {
      next: e,
      error: t,
      complete: r
    }, s.next === void 0 && (s.next = li), s.error === void 0 && (s.error = li), s.complete === void 0 && (s.complete = li);
    const o = this.unsubscribeOne.bind(this, this.observers.length);
    return this.finalized && this.task.then(() => {
      try {
        this.finalError ? s.error(this.finalError) : s.complete();
      } catch {
      }
    }), this.observers.push(s), o;
  }
  // Unsubscribe is synchronous - we guarantee that no events are sent to
  // any unsubscribed Observer.
  unsubscribeOne(e) {
    this.observers === void 0 || this.observers[e] === void 0 || (delete this.observers[e], this.observerCount -= 1, this.observerCount === 0 && this.onNoObservers !== void 0 && this.onNoObservers(this));
  }
  forEachObserver(e) {
    if (!this.finalized)
      for (let t = 0; t < this.observers.length; t++)
        this.sendOne(t, e);
  }
  // Call the Observer via one of it's callback function. We are careful to
  // confirm that the observe has not been unsubscribed since this asynchronous
  // function had been queued.
  sendOne(e, t) {
    this.task.then(() => {
      if (this.observers !== void 0 && this.observers[e] !== void 0)
        try {
          t(this.observers[e]);
        } catch (r) {
          typeof console < "u" && console.error && console.error(r);
        }
    });
  }
  close(e) {
    this.finalized || (this.finalized = !0, e !== void 0 && (this.finalError = e), this.task.then(() => {
      this.observers = void 0, this.onNoObservers = void 0;
    }));
  }
}
function Wd(n, e) {
  if (typeof n != "object" || n === null)
    return !1;
  for (const t of e)
    if (t in n && typeof n[t] == "function")
      return !0;
  return !1;
}
function li() {
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function he(n) {
  return n && n._delegate ? n._delegate : n;
}
class Ot {
  /**
   *
   * @param name The public service name, e.g. app, auth, firestore, database
   * @param instanceFactory Service factory responsible for creating the public interface
   * @param type whether the service provided by the component is public or private
   */
  constructor(e, t, r) {
    this.name = e, this.instanceFactory = t, this.type = r, this.multipleInstances = !1, this.serviceProps = {}, this.instantiationMode = "LAZY", this.onInstanceCreated = null;
  }
  setInstantiationMode(e) {
    return this.instantiationMode = e, this;
  }
  setMultipleInstances(e) {
    return this.multipleInstances = e, this;
  }
  setServiceProps(e) {
    return this.serviceProps = e, this;
  }
  setInstanceCreatedCallback(e) {
    return this.onInstanceCreated = e, this;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const kt = "[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Kd {
  constructor(e, t) {
    this.name = e, this.container = t, this.component = null, this.instances = /* @__PURE__ */ new Map(), this.instancesDeferred = /* @__PURE__ */ new Map(), this.instancesOptions = /* @__PURE__ */ new Map(), this.onInitCallbacks = /* @__PURE__ */ new Map();
  }
  /**
   * @param identifier A provider can provide multiple instances of a service
   * if this.component.multipleInstances is true.
   */
  get(e) {
    const t = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(t)) {
      const r = new bd();
      if (this.instancesDeferred.set(t, r), this.isInitialized(t) || this.shouldAutoInitialize())
        try {
          const s = this.getOrInitializeService({
            instanceIdentifier: t
          });
          s && r.resolve(s);
        } catch {
        }
    }
    return this.instancesDeferred.get(t).promise;
  }
  getImmediate(e) {
    var t;
    const r = this.normalizeInstanceIdentifier(e == null ? void 0 : e.identifier), s = (t = e == null ? void 0 : e.optional) !== null && t !== void 0 ? t : !1;
    if (this.isInitialized(r) || this.shouldAutoInitialize())
      try {
        return this.getOrInitializeService({
          instanceIdentifier: r
        });
      } catch (o) {
        if (s)
          return null;
        throw o;
      }
    else {
      if (s)
        return null;
      throw Error(`Service ${this.name} is not available`);
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(e) {
    if (e.name !== this.name)
      throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
    if (this.component)
      throw Error(`Component for ${this.name} has already been provided`);
    if (this.component = e, !!this.shouldAutoInitialize()) {
      if (Qd(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: kt });
        } catch {
        }
      for (const [t, r] of this.instancesDeferred.entries()) {
        const s = this.normalizeInstanceIdentifier(t);
        try {
          const o = this.getOrInitializeService({
            instanceIdentifier: s
          });
          r.resolve(o);
        } catch {
        }
      }
    }
  }
  clearInstance(e = kt) {
    this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e);
  }
  // app.delete() will call this method on every provider to delete the services
  // TODO: should we mark the provider as deleted?
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([
      ...e.filter((t) => "INTERNAL" in t).map((t) => t.INTERNAL.delete()),
      ...e.filter((t) => "_delete" in t).map((t) => t._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(e = kt) {
    return this.instances.has(e);
  }
  getOptions(e = kt) {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const { options: t = {} } = e, r = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(r))
      throw Error(`${this.name}(${r}) has already been initialized`);
    if (!this.isComponentSet())
      throw Error(`Component ${this.name} has not been registered yet`);
    const s = this.getOrInitializeService({
      instanceIdentifier: r,
      options: t
    });
    for (const [o, a] of this.instancesDeferred.entries()) {
      const u = this.normalizeInstanceIdentifier(o);
      r === u && a.resolve(s);
    }
    return s;
  }
  /**
   *
   * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
   * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
   *
   * @param identifier An optional instance identifier
   * @returns a function to unregister the callback
   */
  onInit(e, t) {
    var r;
    const s = this.normalizeInstanceIdentifier(t), o = (r = this.onInitCallbacks.get(s)) !== null && r !== void 0 ? r : /* @__PURE__ */ new Set();
    o.add(e), this.onInitCallbacks.set(s, o);
    const a = this.instances.get(s);
    return a && e(a, s), () => {
      o.delete(e);
    };
  }
  /**
   * Invoke onInit callbacks synchronously
   * @param instance the service instance`
   */
  invokeOnInitCallbacks(e, t) {
    const r = this.onInitCallbacks.get(t);
    if (r)
      for (const s of r)
        try {
          s(e, t);
        } catch {
        }
  }
  getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
    let r = this.instances.get(e);
    if (!r && this.component && (r = this.component.instanceFactory(this.container, {
      instanceIdentifier: Gd(e),
      options: t
    }), this.instances.set(e, r), this.instancesOptions.set(e, t), this.invokeOnInitCallbacks(r, e), this.component.onInstanceCreated))
      try {
        this.component.onInstanceCreated(this.container, e, r);
      } catch {
      }
    return r || null;
  }
  normalizeInstanceIdentifier(e = kt) {
    return this.component ? this.component.multipleInstances ? e : kt : e;
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}
function Gd(n) {
  return n === kt ? void 0 : n;
}
function Qd(n) {
  return n.instantiationMode === "EAGER";
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Jd {
  constructor(e) {
    this.name = e, this.providers = /* @__PURE__ */ new Map();
  }
  /**
   *
   * @param component Component being added
   * @param overwrite When a component with the same name has already been registered,
   * if overwrite is true: overwrite the existing component with the new component and create a new
   * provider with the new component. It can be useful in tests where you want to use different mocks
   * for different tests.
   * if overwrite is false: throw an exception
   */
  addComponent(e) {
    const t = this.getProvider(e.name);
    if (t.isComponentSet())
      throw new Error(`Component ${e.name} has already been registered with ${this.name}`);
    t.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
  }
  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Firebase SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */
  getProvider(e) {
    if (this.providers.has(e))
      return this.providers.get(e);
    const t = new Kd(e, this);
    return this.providers.set(e, t), t;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var j;
(function(n) {
  n[n.DEBUG = 0] = "DEBUG", n[n.VERBOSE = 1] = "VERBOSE", n[n.INFO = 2] = "INFO", n[n.WARN = 3] = "WARN", n[n.ERROR = 4] = "ERROR", n[n.SILENT = 5] = "SILENT";
})(j || (j = {}));
const Xd = {
  debug: j.DEBUG,
  verbose: j.VERBOSE,
  info: j.INFO,
  warn: j.WARN,
  error: j.ERROR,
  silent: j.SILENT
}, Yd = j.INFO, Zd = {
  [j.DEBUG]: "log",
  [j.VERBOSE]: "log",
  [j.INFO]: "info",
  [j.WARN]: "warn",
  [j.ERROR]: "error"
}, ef = (n, e, ...t) => {
  if (e < n.logLevel)
    return;
  const r = (/* @__PURE__ */ new Date()).toISOString(), s = Zd[e];
  if (s)
    console[s](`[${r}]  ${n.name}:`, ...t);
  else
    throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`);
};
class Hi {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Firebase's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  constructor(e) {
    this.name = e, this._logLevel = Yd, this._logHandler = ef, this._userLogHandler = null;
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(e) {
    if (!(e in j))
      throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
    this._logLevel = e;
  }
  // Workaround for setter/getter having to be the same type.
  setLogLevel(e) {
    this._logLevel = typeof e == "string" ? Xd[e] : e;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(e) {
    if (typeof e != "function")
      throw new TypeError("Value assigned to `logHandler` must be a function");
    this._logHandler = e;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(e) {
    this._userLogHandler = e;
  }
  /**
   * The functions below are all based on the `console` interface
   */
  debug(...e) {
    this._userLogHandler && this._userLogHandler(this, j.DEBUG, ...e), this._logHandler(this, j.DEBUG, ...e);
  }
  log(...e) {
    this._userLogHandler && this._userLogHandler(this, j.VERBOSE, ...e), this._logHandler(this, j.VERBOSE, ...e);
  }
  info(...e) {
    this._userLogHandler && this._userLogHandler(this, j.INFO, ...e), this._logHandler(this, j.INFO, ...e);
  }
  warn(...e) {
    this._userLogHandler && this._userLogHandler(this, j.WARN, ...e), this._logHandler(this, j.WARN, ...e);
  }
  error(...e) {
    this._userLogHandler && this._userLogHandler(this, j.ERROR, ...e), this._logHandler(this, j.ERROR, ...e);
  }
}
const tf = (n, e) => e.some((t) => n instanceof t);
let $a, za;
function nf() {
  return $a || ($a = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function rf() {
  return za || (za = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const Tu = /* @__PURE__ */ new WeakMap(), Ti = /* @__PURE__ */ new WeakMap(), Iu = /* @__PURE__ */ new WeakMap(), hi = /* @__PURE__ */ new WeakMap(), Wi = /* @__PURE__ */ new WeakMap();
function sf(n) {
  const e = new Promise((t, r) => {
    const s = () => {
      n.removeEventListener("success", o), n.removeEventListener("error", a);
    }, o = () => {
      t(ht(n.result)), s();
    }, a = () => {
      r(n.error), s();
    };
    n.addEventListener("success", o), n.addEventListener("error", a);
  });
  return e.then((t) => {
    t instanceof IDBCursor && Tu.set(t, n);
  }).catch(() => {
  }), Wi.set(e, n), e;
}
function of(n) {
  if (Ti.has(n))
    return;
  const e = new Promise((t, r) => {
    const s = () => {
      n.removeEventListener("complete", o), n.removeEventListener("error", a), n.removeEventListener("abort", a);
    }, o = () => {
      t(), s();
    }, a = () => {
      r(n.error || new DOMException("AbortError", "AbortError")), s();
    };
    n.addEventListener("complete", o), n.addEventListener("error", a), n.addEventListener("abort", a);
  });
  Ti.set(n, e);
}
let Ii = {
  get(n, e, t) {
    if (n instanceof IDBTransaction) {
      if (e === "done")
        return Ti.get(n);
      if (e === "objectStoreNames")
        return n.objectStoreNames || Iu.get(n);
      if (e === "store")
        return t.objectStoreNames[1] ? void 0 : t.objectStore(t.objectStoreNames[0]);
    }
    return ht(n[e]);
  },
  set(n, e, t) {
    return n[e] = t, !0;
  },
  has(n, e) {
    return n instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in n;
  }
};
function af(n) {
  Ii = n(Ii);
}
function cf(n) {
  return n === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(e, ...t) {
    const r = n.call(di(this), e, ...t);
    return Iu.set(r, e.sort ? e.sort() : [e]), ht(r);
  } : rf().includes(n) ? function(...e) {
    return n.apply(di(this), e), ht(Tu.get(this));
  } : function(...e) {
    return ht(n.apply(di(this), e));
  };
}
function uf(n) {
  return typeof n == "function" ? cf(n) : (n instanceof IDBTransaction && of(n), tf(n, nf()) ? new Proxy(n, Ii) : n);
}
function ht(n) {
  if (n instanceof IDBRequest)
    return sf(n);
  if (hi.has(n))
    return hi.get(n);
  const e = uf(n);
  return e !== n && (hi.set(n, e), Wi.set(e, n)), e;
}
const di = (n) => Wi.get(n);
function lf(n, e, { blocked: t, upgrade: r, blocking: s, terminated: o } = {}) {
  const a = indexedDB.open(n, e), u = ht(a);
  return r && a.addEventListener("upgradeneeded", (l) => {
    r(ht(a.result), l.oldVersion, l.newVersion, ht(a.transaction), l);
  }), t && a.addEventListener("blocked", (l) => t(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    l.oldVersion,
    l.newVersion,
    l
  )), u.then((l) => {
    o && l.addEventListener("close", () => o()), s && l.addEventListener("versionchange", (d) => s(d.oldVersion, d.newVersion, d));
  }).catch(() => {
  }), u;
}
const hf = ["get", "getKey", "getAll", "getAllKeys", "count"], df = ["put", "add", "delete", "clear"], fi = /* @__PURE__ */ new Map();
function Ha(n, e) {
  if (!(n instanceof IDBDatabase && !(e in n) && typeof e == "string"))
    return;
  if (fi.get(e))
    return fi.get(e);
  const t = e.replace(/FromIndex$/, ""), r = e !== t, s = df.includes(t);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(t in (r ? IDBIndex : IDBObjectStore).prototype) || !(s || hf.includes(t))
  )
    return;
  const o = async function(a, ...u) {
    const l = this.transaction(a, s ? "readwrite" : "readonly");
    let d = l.store;
    return r && (d = d.index(u.shift())), (await Promise.all([
      d[t](...u),
      s && l.done
    ]))[0];
  };
  return fi.set(e, o), o;
}
af((n) => ({
  ...n,
  get: (e, t, r) => Ha(e, t) || n.get(e, t, r),
  has: (e, t) => !!Ha(e, t) || n.has(e, t)
}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ff {
  constructor(e) {
    this.container = e;
  }
  // In initial implementation, this will be called by installations on
  // auth token refresh, and installations will send this string.
  getPlatformInfoString() {
    return this.container.getProviders().map((t) => {
      if (pf(t)) {
        const r = t.getImmediate();
        return `${r.library}/${r.version}`;
      } else
        return null;
    }).filter((t) => t).join(" ");
  }
}
function pf(n) {
  const e = n.getComponent();
  return (e == null ? void 0 : e.type) === "VERSION";
}
const wi = "@firebase/app", Wa = "0.11.4";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Je = new Hi("@firebase/app"), mf = "@firebase/app-compat", gf = "@firebase/analytics-compat", _f = "@firebase/analytics", yf = "@firebase/app-check-compat", vf = "@firebase/app-check", Ef = "@firebase/auth", Tf = "@firebase/auth-compat", If = "@firebase/database", wf = "@firebase/data-connect", Af = "@firebase/database-compat", Rf = "@firebase/functions", Sf = "@firebase/functions-compat", Pf = "@firebase/installations", Cf = "@firebase/installations-compat", bf = "@firebase/messaging", kf = "@firebase/messaging-compat", Vf = "@firebase/performance", Df = "@firebase/performance-compat", Nf = "@firebase/remote-config", Of = "@firebase/remote-config-compat", Lf = "@firebase/storage", Mf = "@firebase/storage-compat", xf = "@firebase/firestore", Uf = "@firebase/vertexai", Ff = "@firebase/firestore-compat", Bf = "firebase", jf = "11.6.0";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ai = "[DEFAULT]", qf = {
  [wi]: "fire-core",
  [mf]: "fire-core-compat",
  [_f]: "fire-analytics",
  [gf]: "fire-analytics-compat",
  [vf]: "fire-app-check",
  [yf]: "fire-app-check-compat",
  [Ef]: "fire-auth",
  [Tf]: "fire-auth-compat",
  [If]: "fire-rtdb",
  [wf]: "fire-data-connect",
  [Af]: "fire-rtdb-compat",
  [Rf]: "fire-fn",
  [Sf]: "fire-fn-compat",
  [Pf]: "fire-iid",
  [Cf]: "fire-iid-compat",
  [bf]: "fire-fcm",
  [kf]: "fire-fcm-compat",
  [Vf]: "fire-perf",
  [Df]: "fire-perf-compat",
  [Nf]: "fire-rc",
  [Of]: "fire-rc-compat",
  [Lf]: "fire-gcs",
  [Mf]: "fire-gcs-compat",
  [xf]: "fire-fst",
  [Ff]: "fire-fst-compat",
  [Uf]: "fire-vertex",
  "fire-js": "fire-js",
  // Platform identifier for JS SDK.
  [Bf]: "fire-js-all"
};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Kn = /* @__PURE__ */ new Map(), $f = /* @__PURE__ */ new Map(), Ri = /* @__PURE__ */ new Map();
function Ka(n, e) {
  try {
    n.container.addComponent(e);
  } catch (t) {
    Je.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`, t);
  }
}
function en(n) {
  const e = n.name;
  if (Ri.has(e))
    return Je.debug(`There were multiple attempts to register component ${e}.`), !1;
  Ri.set(e, n);
  for (const t of Kn.values())
    Ka(t, n);
  for (const t of $f.values())
    Ka(t, n);
  return !0;
}
function Ki(n, e) {
  const t = n.container.getProvider("heartbeat").getImmediate({ optional: !0 });
  return t && t.triggerHeartbeat(), n.container.getProvider(e);
}
function ke(n) {
  return n == null ? !1 : n.settings !== void 0;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const zf = {
  "no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
  "bad-app-name": "Illegal App name: '{$appName}'",
  "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
  "app-deleted": "Firebase App named '{$appName}' already deleted",
  "server-app-deleted": "Firebase Server App has been deleted",
  "no-options": "Need to provide options, when not being deployed to hosting via source.",
  "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  "invalid-log-argument": "First argument to `onLog` must be null or a function.",
  "idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  "idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  "finalization-registry-not-supported": "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  "invalid-server-app-environment": "FirebaseServerApp is not for use in browser environments."
}, dt = new rr("app", "Firebase", zf);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Hf {
  constructor(e, t, r) {
    this._isDeleted = !1, this._options = Object.assign({}, e), this._config = Object.assign({}, t), this._name = t.name, this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled, this._container = r, this.container.addComponent(new Ot(
      "app",
      () => this,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
  }
  get automaticDataCollectionEnabled() {
    return this.checkDestroyed(), this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(e) {
    this.checkDestroyed(), this._automaticDataCollectionEnabled = e;
  }
  get name() {
    return this.checkDestroyed(), this._name;
  }
  get options() {
    return this.checkDestroyed(), this._options;
  }
  get config() {
    return this.checkDestroyed(), this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(e) {
    this._isDeleted = e;
  }
  /**
   * This function will throw an Error if the App has already been deleted -
   * use before performing API actions on the App.
   */
  checkDestroyed() {
    if (this.isDeleted)
      throw dt.create("app-deleted", { appName: this._name });
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const dn = jf;
function wu(n, e = {}) {
  let t = n;
  typeof e != "object" && (e = { name: e });
  const r = Object.assign({ name: Ai, automaticDataCollectionEnabled: !1 }, e), s = r.name;
  if (typeof s != "string" || !s)
    throw dt.create("bad-app-name", {
      appName: String(s)
    });
  if (t || (t = vu()), !t)
    throw dt.create(
      "no-options"
      /* AppError.NO_OPTIONS */
    );
  const o = Kn.get(s);
  if (o) {
    if (Nt(t, o.options) && Nt(r, o.config))
      return o;
    throw dt.create("duplicate-app", { appName: s });
  }
  const a = new Jd(s);
  for (const l of Ri.values())
    a.addComponent(l);
  const u = new Hf(t, r, a);
  return Kn.set(s, u), u;
}
function Gi(n = Ai) {
  const e = Kn.get(n);
  if (!e && n === Ai && vu())
    return wu();
  if (!e)
    throw dt.create("no-app", { appName: n });
  return e;
}
function Wf() {
  return Array.from(Kn.values());
}
function ft(n, e, t) {
  var r;
  let s = (r = qf[n]) !== null && r !== void 0 ? r : n;
  t && (s += `-${t}`);
  const o = s.match(/\s|\//), a = e.match(/\s|\//);
  if (o || a) {
    const u = [
      `Unable to register library "${s}" with version "${e}":`
    ];
    o && u.push(`library name "${s}" contains illegal characters (whitespace or "/")`), o && a && u.push("and"), a && u.push(`version name "${e}" contains illegal characters (whitespace or "/")`), Je.warn(u.join(" "));
    return;
  }
  en(new Ot(
    `${s}-version`,
    () => ({ library: s, version: e }),
    "VERSION"
    /* ComponentType.VERSION */
  ));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Kf = "firebase-heartbeat-database", Gf = 1, Gn = "firebase-heartbeat-store";
let pi = null;
function Au() {
  return pi || (pi = lf(Kf, Gf, {
    upgrade: (n, e) => {
      switch (e) {
        case 0:
          try {
            n.createObjectStore(Gn);
          } catch (t) {
            console.warn(t);
          }
      }
    }
  }).catch((n) => {
    throw dt.create("idb-open", {
      originalErrorMessage: n.message
    });
  })), pi;
}
async function Qf(n) {
  try {
    const t = (await Au()).transaction(Gn), r = await t.objectStore(Gn).get(Ru(n));
    return await t.done, r;
  } catch (e) {
    if (e instanceof et)
      Je.warn(e.message);
    else {
      const t = dt.create("idb-get", {
        originalErrorMessage: e == null ? void 0 : e.message
      });
      Je.warn(t.message);
    }
  }
}
async function Ga(n, e) {
  try {
    const r = (await Au()).transaction(Gn, "readwrite");
    await r.objectStore(Gn).put(e, Ru(n)), await r.done;
  } catch (t) {
    if (t instanceof et)
      Je.warn(t.message);
    else {
      const r = dt.create("idb-set", {
        originalErrorMessage: t == null ? void 0 : t.message
      });
      Je.warn(r.message);
    }
  }
}
function Ru(n) {
  return `${n.name}!${n.options.appId}`;
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Jf = 1024, Xf = 30;
class Yf {
  constructor(e) {
    this.container = e, this._heartbeatsCache = null;
    const t = this.container.getProvider("app").getImmediate();
    this._storage = new ep(t), this._heartbeatsCachePromise = this._storage.read().then((r) => (this._heartbeatsCache = r, r));
  }
  /**
   * Called to report a heartbeat. The function will generate
   * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
   * to IndexedDB.
   * Note that we only store one heartbeat per day. So if a heartbeat for today is
   * already logged, subsequent calls to this function in the same day will be ignored.
   */
  async triggerHeartbeat() {
    var e, t;
    try {
      const s = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(), o = Qa();
      if (((e = this._heartbeatsCache) === null || e === void 0 ? void 0 : e.heartbeats) == null && (this._heartbeatsCache = await this._heartbeatsCachePromise, ((t = this._heartbeatsCache) === null || t === void 0 ? void 0 : t.heartbeats) == null) || this._heartbeatsCache.lastSentHeartbeatDate === o || this._heartbeatsCache.heartbeats.some((a) => a.date === o))
        return;
      if (this._heartbeatsCache.heartbeats.push({ date: o, agent: s }), this._heartbeatsCache.heartbeats.length > Xf) {
        const a = tp(this._heartbeatsCache.heartbeats);
        this._heartbeatsCache.heartbeats.splice(a, 1);
      }
      return this._storage.overwrite(this._heartbeatsCache);
    } catch (r) {
      Je.warn(r);
    }
  }
  /**
   * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
   * It also clears all heartbeats from memory as well as in IndexedDB.
   *
   * NOTE: Consuming product SDKs should not send the header if this method
   * returns an empty string.
   */
  async getHeartbeatsHeader() {
    var e;
    try {
      if (this._heartbeatsCache === null && await this._heartbeatsCachePromise, ((e = this._heartbeatsCache) === null || e === void 0 ? void 0 : e.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0)
        return "";
      const t = Qa(), { heartbeatsToSend: r, unsentEntries: s } = Zf(this._heartbeatsCache.heartbeats), o = Jr(JSON.stringify({ version: 2, heartbeats: r }));
      return this._heartbeatsCache.lastSentHeartbeatDate = t, s.length > 0 ? (this._heartbeatsCache.heartbeats = s, await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [], this._storage.overwrite(this._heartbeatsCache)), o;
    } catch (t) {
      return Je.warn(t), "";
    }
  }
}
function Qa() {
  return (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
}
function Zf(n, e = Jf) {
  const t = [];
  let r = n.slice();
  for (const s of n) {
    const o = t.find((a) => a.agent === s.agent);
    if (o) {
      if (o.dates.push(s.date), Ja(t) > e) {
        o.dates.pop();
        break;
      }
    } else if (t.push({
      agent: s.agent,
      dates: [s.date]
    }), Ja(t) > e) {
      t.pop();
      break;
    }
    r = r.slice(1);
  }
  return {
    heartbeatsToSend: t,
    unsentEntries: r
  };
}
class ep {
  constructor(e) {
    this.app = e, this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    return Ud() ? Fd().then(() => !0).catch(() => !1) : !1;
  }
  /**
   * Read all heartbeats.
   */
  async read() {
    if (await this._canUseIndexedDBPromise) {
      const t = await Qf(this.app);
      return t != null && t.heartbeats ? t : { heartbeats: [] };
    } else
      return { heartbeats: [] };
  }
  // overwrite the storage with the provided heartbeats
  async overwrite(e) {
    var t;
    if (await this._canUseIndexedDBPromise) {
      const s = await this.read();
      return Ga(this.app, {
        lastSentHeartbeatDate: (t = e.lastSentHeartbeatDate) !== null && t !== void 0 ? t : s.lastSentHeartbeatDate,
        heartbeats: e.heartbeats
      });
    } else
      return;
  }
  // add heartbeats
  async add(e) {
    var t;
    if (await this._canUseIndexedDBPromise) {
      const s = await this.read();
      return Ga(this.app, {
        lastSentHeartbeatDate: (t = e.lastSentHeartbeatDate) !== null && t !== void 0 ? t : s.lastSentHeartbeatDate,
        heartbeats: [
          ...s.heartbeats,
          ...e.heartbeats
        ]
      });
    } else
      return;
  }
}
function Ja(n) {
  return Jr(
    // heartbeatsCache wrapper properties
    JSON.stringify({ version: 2, heartbeats: n })
  ).length;
}
function tp(n) {
  if (n.length === 0)
    return -1;
  let e = 0, t = n[0].date;
  for (let r = 1; r < n.length; r++)
    n[r].date < t && (t = n[r].date, e = r);
  return e;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function np(n) {
  en(new Ot(
    "platform-logger",
    (e) => new ff(e),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  )), en(new Ot(
    "heartbeat",
    (e) => new Yf(e),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  )), ft(wi, Wa, n), ft(wi, Wa, "esm2017"), ft("fire-js", "");
}
np("");
function Qi(n, e) {
  var t = {};
  for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && e.indexOf(r) < 0 && (t[r] = n[r]);
  if (n != null && typeof Object.getOwnPropertySymbols == "function")
    for (var s = 0, r = Object.getOwnPropertySymbols(n); s < r.length; s++)
      e.indexOf(r[s]) < 0 && Object.prototype.propertyIsEnumerable.call(n, r[s]) && (t[r[s]] = n[r[s]]);
  return t;
}
function Su() {
  return {
    "dependent-sdk-initialized-before-auth": "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
  };
}
const rp = Su, Pu = new rr("auth", "Firebase", Su());
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Xr = new Hi("@firebase/auth");
function sp(n, ...e) {
  Xr.logLevel <= j.WARN && Xr.warn(`Auth (${dn}): ${n}`, ...e);
}
function Br(n, ...e) {
  Xr.logLevel <= j.ERROR && Xr.error(`Auth (${dn}): ${n}`, ...e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Oe(n, ...e) {
  throw Ji(n, ...e);
}
function Me(n, ...e) {
  return Ji(n, ...e);
}
function Cu(n, e, t) {
  const r = Object.assign(Object.assign({}, rp()), { [e]: t });
  return new rr("auth", "Firebase", r).create(e, {
    appName: n.name
  });
}
function pt(n) {
  return Cu(n, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
}
function Ji(n, ...e) {
  if (typeof n != "string") {
    const t = e[0], r = [...e.slice(1)];
    return r[0] && (r[0].appName = n.name), n._errorFactory.create(t, ...r);
  }
  return Pu.create(n, ...e);
}
function M(n, e, ...t) {
  if (!n)
    throw Ji(e, ...t);
}
function We(n) {
  const e = "INTERNAL ASSERTION FAILED: " + n;
  throw Br(e), new Error(e);
}
function Xe(n, e) {
  n || We(e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Yr() {
  var n;
  return typeof self < "u" && ((n = self.location) === null || n === void 0 ? void 0 : n.href) || "";
}
function ip() {
  return Xa() === "http:" || Xa() === "https:";
}
function Xa() {
  var n;
  return typeof self < "u" && ((n = self.location) === null || n === void 0 ? void 0 : n.protocol) || null;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function op() {
  return typeof navigator < "u" && navigator && "onLine" in navigator && typeof navigator.onLine == "boolean" && // Apply only for traditional web apps and Chrome extensions.
  // This is especially true for Cordova apps which have unreliable
  // navigator.onLine behavior unless cordova-plugin-network-information is
  // installed which overwrites the native navigator.onLine value and
  // defines navigator.connection.
  (ip() || Od() || "connection" in navigator) ? navigator.onLine : !0;
}
function ap() {
  if (typeof navigator > "u")
    return null;
  const n = navigator;
  return (
    // Most reliable, but only supported in Chrome/Firefox.
    n.languages && n.languages[0] || // Supported in most browsers, but returns the language of the browser
    // UI, not the language set in browser settings.
    n.language || // Couldn't determine language.
    null
  );
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ir {
  constructor(e, t) {
    this.shortDelay = e, this.longDelay = t, Xe(t > e, "Short delay should be less than long delay!"), this.isMobile = Vd() || Ld();
  }
  get() {
    return op() ? this.isMobile ? this.longDelay : this.shortDelay : Math.min(5e3, this.shortDelay);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Xi(n, e) {
  Xe(n.emulator, "Emulator should always be set here");
  const { url: t } = n.emulator;
  return e ? `${t}${e.startsWith("/") ? e.slice(1) : e}` : t;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class bu {
  static initialize(e, t, r) {
    this.fetchImpl = e, t && (this.headersImpl = t), r && (this.responseImpl = r);
  }
  static fetch() {
    if (this.fetchImpl)
      return this.fetchImpl;
    if (typeof self < "u" && "fetch" in self)
      return self.fetch;
    if (typeof globalThis < "u" && globalThis.fetch)
      return globalThis.fetch;
    if (typeof fetch < "u")
      return fetch;
    We("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static headers() {
    if (this.headersImpl)
      return this.headersImpl;
    if (typeof self < "u" && "Headers" in self)
      return self.Headers;
    if (typeof globalThis < "u" && globalThis.Headers)
      return globalThis.Headers;
    if (typeof Headers < "u")
      return Headers;
    We("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static response() {
    if (this.responseImpl)
      return this.responseImpl;
    if (typeof self < "u" && "Response" in self)
      return self.Response;
    if (typeof globalThis < "u" && globalThis.Response)
      return globalThis.Response;
    if (typeof Response < "u")
      return Response;
    We("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const cp = {
  // Custom token errors.
  CREDENTIAL_MISMATCH: "custom-token-mismatch",
  // This can only happen if the SDK sends a bad request.
  MISSING_CUSTOM_TOKEN: "internal-error",
  // Create Auth URI errors.
  INVALID_IDENTIFIER: "invalid-email",
  // This can only happen if the SDK sends a bad request.
  MISSING_CONTINUE_URI: "internal-error",
  // Sign in with email and password errors (some apply to sign up too).
  INVALID_PASSWORD: "wrong-password",
  // This can only happen if the SDK sends a bad request.
  MISSING_PASSWORD: "missing-password",
  // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
  // invalid.
  INVALID_LOGIN_CREDENTIALS: "invalid-credential",
  // Sign up with email and password errors.
  EMAIL_EXISTS: "email-already-in-use",
  PASSWORD_LOGIN_DISABLED: "operation-not-allowed",
  // Verify assertion for sign in with credential errors:
  INVALID_IDP_RESPONSE: "invalid-credential",
  INVALID_PENDING_TOKEN: "invalid-credential",
  FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use",
  // This can only happen if the SDK sends a bad request.
  MISSING_REQ_TYPE: "internal-error",
  // Send Password reset email errors:
  EMAIL_NOT_FOUND: "user-not-found",
  RESET_PASSWORD_EXCEED_LIMIT: "too-many-requests",
  EXPIRED_OOB_CODE: "expired-action-code",
  INVALID_OOB_CODE: "invalid-action-code",
  // This can only happen if the SDK sends a bad request.
  MISSING_OOB_CODE: "internal-error",
  // Operations that require ID token in request:
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
  INVALID_ID_TOKEN: "invalid-user-token",
  TOKEN_EXPIRED: "user-token-expired",
  USER_NOT_FOUND: "user-token-expired",
  // Other errors.
  TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests",
  PASSWORD_DOES_NOT_MEET_REQUIREMENTS: "password-does-not-meet-requirements",
  // Phone Auth related errors.
  INVALID_CODE: "invalid-verification-code",
  INVALID_SESSION_INFO: "invalid-verification-id",
  INVALID_TEMPORARY_PROOF: "invalid-credential",
  MISSING_SESSION_INFO: "missing-verification-id",
  SESSION_EXPIRED: "code-expired",
  // Other action code errors when additional settings passed.
  // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
  // This is OK as this error will be caught by client side validation.
  MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name",
  UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri",
  // getProjectConfig errors when clientId is passed.
  INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id",
  // User actions (sign-up or deletion) disabled errors.
  ADMIN_ONLY_OPERATION: "admin-restricted-operation",
  // Multi factor related errors.
  INVALID_MFA_PENDING_CREDENTIAL: "invalid-multi-factor-session",
  MFA_ENROLLMENT_NOT_FOUND: "multi-factor-info-not-found",
  MISSING_MFA_ENROLLMENT_ID: "missing-multi-factor-info",
  MISSING_MFA_PENDING_CREDENTIAL: "missing-multi-factor-session",
  SECOND_FACTOR_EXISTS: "second-factor-already-in-use",
  SECOND_FACTOR_LIMIT_EXCEEDED: "maximum-second-factor-count-exceeded",
  // Blocking functions related errors.
  BLOCKING_FUNCTION_ERROR_RESPONSE: "internal-error",
  // Recaptcha related errors.
  RECAPTCHA_NOT_ENABLED: "recaptcha-not-enabled",
  MISSING_RECAPTCHA_TOKEN: "missing-recaptcha-token",
  INVALID_RECAPTCHA_TOKEN: "invalid-recaptcha-token",
  INVALID_RECAPTCHA_ACTION: "invalid-recaptcha-action",
  MISSING_CLIENT_TYPE: "missing-client-type",
  MISSING_RECAPTCHA_VERSION: "missing-recaptcha-version",
  INVALID_RECAPTCHA_VERSION: "invalid-recaptcha-version",
  INVALID_REQ_TYPE: "invalid-req-type"
  /* AuthErrorCode.INVALID_REQ_TYPE */
};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const up = [
  "/v1/accounts:signInWithCustomToken",
  "/v1/accounts:signInWithEmailLink",
  "/v1/accounts:signInWithIdp",
  "/v1/accounts:signInWithPassword",
  "/v1/accounts:signInWithPhoneNumber",
  "/v1/token"
  /* Endpoint.TOKEN */
], lp = new ir(3e4, 6e4);
function Ut(n, e) {
  return n.tenantId && !e.tenantId ? Object.assign(Object.assign({}, e), { tenantId: n.tenantId }) : e;
}
async function wt(n, e, t, r, s = {}) {
  return ku(n, s, async () => {
    let o = {}, a = {};
    r && (e === "GET" ? a = r : o = {
      body: JSON.stringify(r)
    });
    const u = sr(Object.assign({ key: n.config.apiKey }, a)).slice(1), l = await n._getAdditionalHeaders();
    l[
      "Content-Type"
      /* HttpHeader.CONTENT_TYPE */
    ] = "application/json", n.languageCode && (l[
      "X-Firebase-Locale"
      /* HttpHeader.X_FIREBASE_LOCALE */
    ] = n.languageCode);
    const d = Object.assign({
      method: e,
      headers: l
    }, o);
    return Nd() || (d.referrerPolicy = "no-referrer"), bu.fetch()(await Vu(n, n.config.apiHost, t, u), d);
  });
}
async function ku(n, e, t) {
  n._canInitEmulator = !1;
  const r = Object.assign(Object.assign({}, cp), e);
  try {
    const s = new dp(n), o = await Promise.race([
      t(),
      s.promise
    ]);
    s.clearNetworkTimeout();
    const a = await o.json();
    if ("needConfirmation" in a)
      throw Dr(n, "account-exists-with-different-credential", a);
    if (o.ok && !("errorMessage" in a))
      return a;
    {
      const u = o.ok ? a.errorMessage : a.error.message, [l, d] = u.split(" : ");
      if (l === "FEDERATED_USER_ID_ALREADY_LINKED")
        throw Dr(n, "credential-already-in-use", a);
      if (l === "EMAIL_EXISTS")
        throw Dr(n, "email-already-in-use", a);
      if (l === "USER_DISABLED")
        throw Dr(n, "user-disabled", a);
      const p = r[l] || l.toLowerCase().replace(/[_\s]+/g, "-");
      if (d)
        throw Cu(n, p, d);
      Oe(n, p);
    }
  } catch (s) {
    if (s instanceof et)
      throw s;
    Oe(n, "network-request-failed", { message: String(s) });
  }
}
async function ys(n, e, t, r, s = {}) {
  const o = await wt(n, e, t, r, s);
  return "mfaPendingCredential" in o && Oe(n, "multi-factor-auth-required", {
    _serverResponse: o
  }), o;
}
async function Vu(n, e, t, r) {
  const s = `${e}${t}?${r}`, o = n, a = o.config.emulator ? Xi(n.config, s) : `${n.config.apiScheme}://${s}`;
  return up.includes(t) && (await o._persistenceManagerAvailable, o._getPersistenceType() === "COOKIE") ? o._getPersistence()._getFinalTarget(a).toString() : a;
}
function hp(n) {
  switch (n) {
    case "ENFORCE":
      return "ENFORCE";
    case "AUDIT":
      return "AUDIT";
    case "OFF":
      return "OFF";
    default:
      return "ENFORCEMENT_STATE_UNSPECIFIED";
  }
}
class dp {
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
  constructor(e) {
    this.auth = e, this.timer = null, this.promise = new Promise((t, r) => {
      this.timer = setTimeout(() => r(Me(
        this.auth,
        "network-request-failed"
        /* AuthErrorCode.NETWORK_REQUEST_FAILED */
      )), lp.get());
    });
  }
}
function Dr(n, e, t) {
  const r = {
    appName: n.name
  };
  t.email && (r.email = t.email), t.phoneNumber && (r.phoneNumber = t.phoneNumber);
  const s = Me(n, e, r);
  return s.customData._tokenResponse = t, s;
}
function Ya(n) {
  return n !== void 0 && n.enterprise !== void 0;
}
class fp {
  constructor(e) {
    if (this.siteKey = "", this.recaptchaEnforcementState = [], e.recaptchaKey === void 0)
      throw new Error("recaptchaKey undefined");
    this.siteKey = e.recaptchaKey.split("/")[3], this.recaptchaEnforcementState = e.recaptchaEnforcementState;
  }
  /**
   * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
   *
   * @param providerStr - The provider whose enforcement state is to be returned.
   * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
   */
  getProviderEnforcementState(e) {
    if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0)
      return null;
    for (const t of this.recaptchaEnforcementState)
      if (t.provider && t.provider === e)
        return hp(t.enforcementState);
    return null;
  }
  /**
   * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
   *
   * @param providerStr - The provider whose enablement state is to be returned.
   * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
   */
  isProviderEnabled(e) {
    return this.getProviderEnforcementState(e) === "ENFORCE" || this.getProviderEnforcementState(e) === "AUDIT";
  }
  /**
   * Returns true if reCAPTCHA Enterprise protection is enabled in at least one provider, otherwise
   * returns false.
   *
   * @returns Whether or not reCAPTCHA Enterprise protection is enabled for at least one provider.
   */
  isAnyProviderEnabled() {
    return this.isProviderEnabled(
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
    ) || this.isProviderEnabled(
      "PHONE_PROVIDER"
      /* RecaptchaAuthProvider.PHONE_PROVIDER */
    );
  }
}
async function pp(n, e) {
  return wt(n, "GET", "/v2/recaptchaConfig", Ut(n, e));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function mp(n, e) {
  return wt(n, "POST", "/v1/accounts:delete", e);
}
async function Zr(n, e) {
  return wt(n, "POST", "/v1/accounts:lookup", e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function qn(n) {
  if (n)
    try {
      const e = new Date(Number(n));
      if (!isNaN(e.getTime()))
        return e.toUTCString();
    } catch {
    }
}
async function gp(n, e = !1) {
  const t = he(n), r = await t.getIdToken(e), s = Yi(r);
  M(
    s && s.exp && s.auth_time && s.iat,
    t.auth,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  const o = typeof s.firebase == "object" ? s.firebase : void 0, a = o == null ? void 0 : o.sign_in_provider;
  return {
    claims: s,
    token: r,
    authTime: qn(mi(s.auth_time)),
    issuedAtTime: qn(mi(s.iat)),
    expirationTime: qn(mi(s.exp)),
    signInProvider: a || null,
    signInSecondFactor: (o == null ? void 0 : o.sign_in_second_factor) || null
  };
}
function mi(n) {
  return Number(n) * 1e3;
}
function Yi(n) {
  const [e, t, r] = n.split(".");
  if (e === void 0 || t === void 0 || r === void 0)
    return Br("JWT malformed, contained fewer than 3 sections"), null;
  try {
    const s = _u(t);
    return s ? JSON.parse(s) : (Br("Failed to decode base64 JWT payload"), null);
  } catch (s) {
    return Br("Caught error parsing JWT payload as JSON", s == null ? void 0 : s.toString()), null;
  }
}
function Za(n) {
  const e = Yi(n);
  return M(
    e,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  ), M(
    typeof e.exp < "u",
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  ), M(
    typeof e.iat < "u",
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  ), Number(e.exp) - Number(e.iat);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Qn(n, e, t = !1) {
  if (t)
    return e;
  try {
    return await e;
  } catch (r) {
    throw r instanceof et && _p(r) && n.auth.currentUser === n && await n.auth.signOut(), r;
  }
}
function _p({ code: n }) {
  return n === "auth/user-disabled" || n === "auth/user-token-expired";
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class yp {
  constructor(e) {
    this.user = e, this.isRunning = !1, this.timerId = null, this.errorBackoff = 3e4;
  }
  _start() {
    this.isRunning || (this.isRunning = !0, this.schedule());
  }
  _stop() {
    this.isRunning && (this.isRunning = !1, this.timerId !== null && clearTimeout(this.timerId));
  }
  getInterval(e) {
    var t;
    if (e) {
      const r = this.errorBackoff;
      return this.errorBackoff = Math.min(
        this.errorBackoff * 2,
        96e4
        /* Duration.RETRY_BACKOFF_MAX */
      ), r;
    } else {
      this.errorBackoff = 3e4;
      const s = ((t = this.user.stsTokenManager.expirationTime) !== null && t !== void 0 ? t : 0) - Date.now() - 3e5;
      return Math.max(0, s);
    }
  }
  schedule(e = !1) {
    if (!this.isRunning)
      return;
    const t = this.getInterval(e);
    this.timerId = setTimeout(async () => {
      await this.iteration();
    }, t);
  }
  async iteration() {
    try {
      await this.user.getIdToken(!0);
    } catch (e) {
      (e == null ? void 0 : e.code) === "auth/network-request-failed" && this.schedule(
        /* wasError */
        !0
      );
      return;
    }
    this.schedule();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Si {
  constructor(e, t) {
    this.createdAt = e, this.lastLoginAt = t, this._initializeTime();
  }
  _initializeTime() {
    this.lastSignInTime = qn(this.lastLoginAt), this.creationTime = qn(this.createdAt);
  }
  _copy(e) {
    this.createdAt = e.createdAt, this.lastLoginAt = e.lastLoginAt, this._initializeTime();
  }
  toJSON() {
    return {
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt
    };
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function es(n) {
  var e;
  const t = n.auth, r = await n.getIdToken(), s = await Qn(n, Zr(t, { idToken: r }));
  M(
    s == null ? void 0 : s.users.length,
    t,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  const o = s.users[0];
  n._notifyReloadListener(o);
  const a = !((e = o.providerUserInfo) === null || e === void 0) && e.length ? Du(o.providerUserInfo) : [], u = Ep(n.providerData, a), l = n.isAnonymous, d = !(n.email && o.passwordHash) && !(u != null && u.length), p = l ? d : !1, y = {
    uid: o.localId,
    displayName: o.displayName || null,
    photoURL: o.photoUrl || null,
    email: o.email || null,
    emailVerified: o.emailVerified || !1,
    phoneNumber: o.phoneNumber || null,
    tenantId: o.tenantId || null,
    providerData: u,
    metadata: new Si(o.createdAt, o.lastLoginAt),
    isAnonymous: p
  };
  Object.assign(n, y);
}
async function vp(n) {
  const e = he(n);
  await es(e), await e.auth._persistUserIfCurrent(e), e.auth._notifyListenersIfCurrent(e);
}
function Ep(n, e) {
  return [...n.filter((r) => !e.some((s) => s.providerId === r.providerId)), ...e];
}
function Du(n) {
  return n.map((e) => {
    var { providerId: t } = e, r = Qi(e, ["providerId"]);
    return {
      providerId: t,
      uid: r.rawId || "",
      displayName: r.displayName || null,
      email: r.email || null,
      phoneNumber: r.phoneNumber || null,
      photoURL: r.photoUrl || null
    };
  });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Tp(n, e) {
  const t = await ku(n, {}, async () => {
    const r = sr({
      grant_type: "refresh_token",
      refresh_token: e
    }).slice(1), { tokenApiHost: s, apiKey: o } = n.config, a = await Vu(n, s, "/v1/token", `key=${o}`), u = await n._getAdditionalHeaders();
    return u[
      "Content-Type"
      /* HttpHeader.CONTENT_TYPE */
    ] = "application/x-www-form-urlencoded", bu.fetch()(a, {
      method: "POST",
      headers: u,
      body: r
    });
  });
  return {
    accessToken: t.access_token,
    expiresIn: t.expires_in,
    refreshToken: t.refresh_token
  };
}
async function Ip(n, e) {
  return wt(n, "POST", "/v2/accounts:revokeToken", Ut(n, e));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Jt {
  constructor() {
    this.refreshToken = null, this.accessToken = null, this.expirationTime = null;
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
  }
  updateFromServerResponse(e) {
    M(
      e.idToken,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), M(
      typeof e.idToken < "u",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), M(
      typeof e.refreshToken < "u",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const t = "expiresIn" in e && typeof e.expiresIn < "u" ? Number(e.expiresIn) : Za(e.idToken);
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, t);
  }
  updateFromIdToken(e) {
    M(
      e.length !== 0,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const t = Za(e);
    this.updateTokensAndExpiration(e, null, t);
  }
  async getToken(e, t = !1) {
    return !t && this.accessToken && !this.isExpired ? this.accessToken : (M(
      this.refreshToken,
      e,
      "user-token-expired"
      /* AuthErrorCode.TOKEN_EXPIRED */
    ), this.refreshToken ? (await this.refresh(e, this.refreshToken), this.accessToken) : null);
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  async refresh(e, t) {
    const { accessToken: r, refreshToken: s, expiresIn: o } = await Tp(e, t);
    this.updateTokensAndExpiration(r, s, Number(o));
  }
  updateTokensAndExpiration(e, t, r) {
    this.refreshToken = t || null, this.accessToken = e || null, this.expirationTime = Date.now() + r * 1e3;
  }
  static fromJSON(e, t) {
    const { refreshToken: r, accessToken: s, expirationTime: o } = t, a = new Jt();
    return r && (M(typeof r == "string", "internal-error", {
      appName: e
    }), a.refreshToken = r), s && (M(typeof s == "string", "internal-error", {
      appName: e
    }), a.accessToken = s), o && (M(typeof o == "number", "internal-error", {
      appName: e
    }), a.expirationTime = o), a;
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime
    };
  }
  _assign(e) {
    this.accessToken = e.accessToken, this.refreshToken = e.refreshToken, this.expirationTime = e.expirationTime;
  }
  _clone() {
    return Object.assign(new Jt(), this.toJSON());
  }
  _performRefresh() {
    return We("not implemented");
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function it(n, e) {
  M(typeof n == "string" || typeof n > "u", "internal-error", { appName: e });
}
class Ve {
  constructor(e) {
    var { uid: t, auth: r, stsTokenManager: s } = e, o = Qi(e, ["uid", "auth", "stsTokenManager"]);
    this.providerId = "firebase", this.proactiveRefresh = new yp(this), this.reloadUserInfo = null, this.reloadListener = null, this.uid = t, this.auth = r, this.stsTokenManager = s, this.accessToken = s.accessToken, this.displayName = o.displayName || null, this.email = o.email || null, this.emailVerified = o.emailVerified || !1, this.phoneNumber = o.phoneNumber || null, this.photoURL = o.photoURL || null, this.isAnonymous = o.isAnonymous || !1, this.tenantId = o.tenantId || null, this.providerData = o.providerData ? [...o.providerData] : [], this.metadata = new Si(o.createdAt || void 0, o.lastLoginAt || void 0);
  }
  async getIdToken(e) {
    const t = await Qn(this, this.stsTokenManager.getToken(this.auth, e));
    return M(
      t,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), this.accessToken !== t && (this.accessToken = t, await this.auth._persistUserIfCurrent(this), this.auth._notifyListenersIfCurrent(this)), t;
  }
  getIdTokenResult(e) {
    return gp(this, e);
  }
  reload() {
    return vp(this);
  }
  _assign(e) {
    this !== e && (M(
      this.uid === e.uid,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), this.displayName = e.displayName, this.photoURL = e.photoURL, this.email = e.email, this.emailVerified = e.emailVerified, this.phoneNumber = e.phoneNumber, this.isAnonymous = e.isAnonymous, this.tenantId = e.tenantId, this.providerData = e.providerData.map((t) => Object.assign({}, t)), this.metadata._copy(e.metadata), this.stsTokenManager._assign(e.stsTokenManager));
  }
  _clone(e) {
    const t = new Ve(Object.assign(Object.assign({}, this), { auth: e, stsTokenManager: this.stsTokenManager._clone() }));
    return t.metadata._copy(this.metadata), t;
  }
  _onReload(e) {
    M(
      !this.reloadListener,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), this.reloadListener = e, this.reloadUserInfo && (this._notifyReloadListener(this.reloadUserInfo), this.reloadUserInfo = null);
  }
  _notifyReloadListener(e) {
    this.reloadListener ? this.reloadListener(e) : this.reloadUserInfo = e;
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start();
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop();
  }
  async _updateTokensIfNecessary(e, t = !1) {
    let r = !1;
    e.idToken && e.idToken !== this.stsTokenManager.accessToken && (this.stsTokenManager.updateFromServerResponse(e), r = !0), t && await es(this), await this.auth._persistUserIfCurrent(this), r && this.auth._notifyListenersIfCurrent(this);
  }
  async delete() {
    if (ke(this.auth.app))
      return Promise.reject(pt(this.auth));
    const e = await this.getIdToken();
    return await Qn(this, mp(this.auth, { idToken: e })), this.stsTokenManager.clearRefreshToken(), this.auth.signOut();
  }
  toJSON() {
    return Object.assign(Object.assign({
      uid: this.uid,
      email: this.email || void 0,
      emailVerified: this.emailVerified,
      displayName: this.displayName || void 0,
      isAnonymous: this.isAnonymous,
      photoURL: this.photoURL || void 0,
      phoneNumber: this.phoneNumber || void 0,
      tenantId: this.tenantId || void 0,
      providerData: this.providerData.map((e) => Object.assign({}, e)),
      stsTokenManager: this.stsTokenManager.toJSON(),
      // Redirect event ID must be maintained in case there is a pending
      // redirect event.
      _redirectEventId: this._redirectEventId
    }, this.metadata.toJSON()), {
      // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
      apiKey: this.auth.config.apiKey,
      appName: this.auth.name
    });
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || "";
  }
  static _fromJSON(e, t) {
    var r, s, o, a, u, l, d, p;
    const y = (r = t.displayName) !== null && r !== void 0 ? r : void 0, w = (s = t.email) !== null && s !== void 0 ? s : void 0, P = (o = t.phoneNumber) !== null && o !== void 0 ? o : void 0, k = (a = t.photoURL) !== null && a !== void 0 ? a : void 0, N = (u = t.tenantId) !== null && u !== void 0 ? u : void 0, V = (l = t._redirectEventId) !== null && l !== void 0 ? l : void 0, K = (d = t.createdAt) !== null && d !== void 0 ? d : void 0, z = (p = t.lastLoginAt) !== null && p !== void 0 ? p : void 0, { uid: H, emailVerified: ee, isAnonymous: Ce, providerData: te, stsTokenManager: E } = t;
    M(
      H && E,
      e,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const m = Jt.fromJSON(this.name, E);
    M(
      typeof H == "string",
      e,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), it(y, e.name), it(w, e.name), M(
      typeof ee == "boolean",
      e,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), M(
      typeof Ce == "boolean",
      e,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), it(P, e.name), it(k, e.name), it(N, e.name), it(V, e.name), it(K, e.name), it(z, e.name);
    const _ = new Ve({
      uid: H,
      auth: e,
      email: w,
      emailVerified: ee,
      displayName: y,
      isAnonymous: Ce,
      photoURL: k,
      phoneNumber: P,
      tenantId: N,
      stsTokenManager: m,
      createdAt: K,
      lastLoginAt: z
    });
    return te && Array.isArray(te) && (_.providerData = te.map((v) => Object.assign({}, v))), V && (_._redirectEventId = V), _;
  }
  /**
   * Initialize a User from an idToken server response
   * @param auth
   * @param idTokenResponse
   */
  static async _fromIdTokenResponse(e, t, r = !1) {
    const s = new Jt();
    s.updateFromServerResponse(t);
    const o = new Ve({
      uid: t.localId,
      auth: e,
      stsTokenManager: s,
      isAnonymous: r
    });
    return await es(o), o;
  }
  /**
   * Initialize a User from an idToken server response
   * @param auth
   * @param idTokenResponse
   */
  static async _fromGetAccountInfoResponse(e, t, r) {
    const s = t.users[0];
    M(
      s.localId !== void 0,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const o = s.providerUserInfo !== void 0 ? Du(s.providerUserInfo) : [], a = !(s.email && s.passwordHash) && !(o != null && o.length), u = new Jt();
    u.updateFromIdToken(r);
    const l = new Ve({
      uid: s.localId,
      auth: e,
      stsTokenManager: u,
      isAnonymous: a
    }), d = {
      uid: s.localId,
      displayName: s.displayName || null,
      photoURL: s.photoUrl || null,
      email: s.email || null,
      emailVerified: s.emailVerified || !1,
      phoneNumber: s.phoneNumber || null,
      tenantId: s.tenantId || null,
      providerData: o,
      metadata: new Si(s.createdAt, s.lastLoginAt),
      isAnonymous: !(s.email && s.passwordHash) && !(o != null && o.length)
    };
    return Object.assign(l, d), l;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ec = /* @__PURE__ */ new Map();
function Ke(n) {
  Xe(n instanceof Function, "Expected a class definition");
  let e = ec.get(n);
  return e ? (Xe(e instanceof n, "Instance stored in cache mismatched with class"), e) : (e = new n(), ec.set(n, e), e);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Nu {
  constructor() {
    this.type = "NONE", this.storage = {};
  }
  async _isAvailable() {
    return !0;
  }
  async _set(e, t) {
    this.storage[e] = t;
  }
  async _get(e) {
    const t = this.storage[e];
    return t === void 0 ? null : t;
  }
  async _remove(e) {
    delete this.storage[e];
  }
  _addListener(e, t) {
  }
  _removeListener(e, t) {
  }
}
Nu.type = "NONE";
const tc = Nu;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function jr(n, e, t) {
  return `firebase:${n}:${e}:${t}`;
}
class Xt {
  constructor(e, t, r) {
    this.persistence = e, this.auth = t, this.userKey = r;
    const { config: s, name: o } = this.auth;
    this.fullUserKey = jr(this.userKey, s.apiKey, o), this.fullPersistenceKey = jr("persistence", s.apiKey, o), this.boundEventHandler = t._onStorageEvent.bind(t), this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
  }
  setCurrentUser(e) {
    return this.persistence._set(this.fullUserKey, e.toJSON());
  }
  async getCurrentUser() {
    const e = await this.persistence._get(this.fullUserKey);
    if (!e)
      return null;
    if (typeof e == "string") {
      const t = await Zr(this.auth, { idToken: e }).catch(() => {
      });
      return t ? Ve._fromGetAccountInfoResponse(this.auth, t, e) : null;
    }
    return Ve._fromJSON(this.auth, e);
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey);
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
  }
  async setPersistence(e) {
    if (this.persistence === e)
      return;
    const t = await this.getCurrentUser();
    if (await this.removeCurrentUser(), this.persistence = e, t)
      return this.setCurrentUser(t);
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static async create(e, t, r = "authUser") {
    if (!t.length)
      return new Xt(Ke(tc), e, r);
    const s = (await Promise.all(t.map(async (d) => {
      if (await d._isAvailable())
        return d;
    }))).filter((d) => d);
    let o = s[0] || Ke(tc);
    const a = jr(r, e.config.apiKey, e.name);
    let u = null;
    for (const d of t)
      try {
        const p = await d._get(a);
        if (p) {
          let y;
          if (typeof p == "string") {
            const w = await Zr(e, {
              idToken: p
            }).catch(() => {
            });
            if (!w)
              break;
            y = await Ve._fromGetAccountInfoResponse(e, w, p);
          } else
            y = Ve._fromJSON(e, p);
          d !== o && (u = y), o = d;
          break;
        }
      } catch {
      }
    const l = s.filter((d) => d._shouldAllowMigration);
    return !o._shouldAllowMigration || !l.length ? new Xt(o, e, r) : (o = l[0], u && await o._set(a, u.toJSON()), await Promise.all(t.map(async (d) => {
      if (d !== o)
        try {
          await d._remove(a);
        } catch {
        }
    })), new Xt(o, e, r));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function nc(n) {
  const e = n.toLowerCase();
  if (e.includes("opera/") || e.includes("opr/") || e.includes("opios/"))
    return "Opera";
  if (xu(e))
    return "IEMobile";
  if (e.includes("msie") || e.includes("trident/"))
    return "IE";
  if (e.includes("edge/"))
    return "Edge";
  if (Ou(e))
    return "Firefox";
  if (e.includes("silk/"))
    return "Silk";
  if (Fu(e))
    return "Blackberry";
  if (Bu(e))
    return "Webos";
  if (Lu(e))
    return "Safari";
  if ((e.includes("chrome/") || Mu(e)) && !e.includes("edge/"))
    return "Chrome";
  if (Uu(e))
    return "Android";
  {
    const t = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/, r = n.match(t);
    if ((r == null ? void 0 : r.length) === 2)
      return r[1];
  }
  return "Other";
}
function Ou(n = Ee()) {
  return /firefox\//i.test(n);
}
function Lu(n = Ee()) {
  const e = n.toLowerCase();
  return e.includes("safari/") && !e.includes("chrome/") && !e.includes("crios/") && !e.includes("android");
}
function Mu(n = Ee()) {
  return /crios\//i.test(n);
}
function xu(n = Ee()) {
  return /iemobile/i.test(n);
}
function Uu(n = Ee()) {
  return /android/i.test(n);
}
function Fu(n = Ee()) {
  return /blackberry/i.test(n);
}
function Bu(n = Ee()) {
  return /webos/i.test(n);
}
function Zi(n = Ee()) {
  return /iphone|ipad|ipod/i.test(n) || /macintosh/i.test(n) && /mobile/i.test(n);
}
function wp(n = Ee()) {
  var e;
  return Zi(n) && !!(!((e = window.navigator) === null || e === void 0) && e.standalone);
}
function Ap() {
  return Md() && document.documentMode === 10;
}
function ju(n = Ee()) {
  return Zi(n) || Uu(n) || Bu(n) || Fu(n) || /windows phone/i.test(n) || xu(n);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function qu(n, e = []) {
  let t;
  switch (n) {
    case "Browser":
      t = nc(Ee());
      break;
    case "Worker":
      t = `${nc(Ee())}-${n}`;
      break;
    default:
      t = n;
  }
  const r = e.length ? e.join(",") : "FirebaseCore-web";
  return `${t}/JsCore/${dn}/${r}`;
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Rp {
  constructor(e) {
    this.auth = e, this.queue = [];
  }
  pushCallback(e, t) {
    const r = (o) => new Promise((a, u) => {
      try {
        const l = e(o);
        a(l);
      } catch (l) {
        u(l);
      }
    });
    r.onAbort = t, this.queue.push(r);
    const s = this.queue.length - 1;
    return () => {
      this.queue[s] = () => Promise.resolve();
    };
  }
  async runMiddleware(e) {
    if (this.auth.currentUser === e)
      return;
    const t = [];
    try {
      for (const r of this.queue)
        await r(e), r.onAbort && t.push(r.onAbort);
    } catch (r) {
      t.reverse();
      for (const s of t)
        try {
          s();
        } catch {
        }
      throw this.auth._errorFactory.create("login-blocked", {
        originalMessage: r == null ? void 0 : r.message
      });
    }
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Sp(n, e = {}) {
  return wt(n, "GET", "/v2/passwordPolicy", Ut(n, e));
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Pp = 6;
class Cp {
  constructor(e) {
    var t, r, s, o;
    const a = e.customStrengthOptions;
    this.customStrengthOptions = {}, this.customStrengthOptions.minPasswordLength = (t = a.minPasswordLength) !== null && t !== void 0 ? t : Pp, a.maxPasswordLength && (this.customStrengthOptions.maxPasswordLength = a.maxPasswordLength), a.containsLowercaseCharacter !== void 0 && (this.customStrengthOptions.containsLowercaseLetter = a.containsLowercaseCharacter), a.containsUppercaseCharacter !== void 0 && (this.customStrengthOptions.containsUppercaseLetter = a.containsUppercaseCharacter), a.containsNumericCharacter !== void 0 && (this.customStrengthOptions.containsNumericCharacter = a.containsNumericCharacter), a.containsNonAlphanumericCharacter !== void 0 && (this.customStrengthOptions.containsNonAlphanumericCharacter = a.containsNonAlphanumericCharacter), this.enforcementState = e.enforcementState, this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED" && (this.enforcementState = "OFF"), this.allowedNonAlphanumericCharacters = (s = (r = e.allowedNonAlphanumericCharacters) === null || r === void 0 ? void 0 : r.join("")) !== null && s !== void 0 ? s : "", this.forceUpgradeOnSignin = (o = e.forceUpgradeOnSignin) !== null && o !== void 0 ? o : !1, this.schemaVersion = e.schemaVersion;
  }
  validatePassword(e) {
    var t, r, s, o, a, u;
    const l = {
      isValid: !0,
      passwordPolicy: this
    };
    return this.validatePasswordLengthOptions(e, l), this.validatePasswordCharacterOptions(e, l), l.isValid && (l.isValid = (t = l.meetsMinPasswordLength) !== null && t !== void 0 ? t : !0), l.isValid && (l.isValid = (r = l.meetsMaxPasswordLength) !== null && r !== void 0 ? r : !0), l.isValid && (l.isValid = (s = l.containsLowercaseLetter) !== null && s !== void 0 ? s : !0), l.isValid && (l.isValid = (o = l.containsUppercaseLetter) !== null && o !== void 0 ? o : !0), l.isValid && (l.isValid = (a = l.containsNumericCharacter) !== null && a !== void 0 ? a : !0), l.isValid && (l.isValid = (u = l.containsNonAlphanumericCharacter) !== null && u !== void 0 ? u : !0), l;
  }
  /**
   * Validates that the password meets the length options for the policy.
   *
   * @param password Password to validate.
   * @param status Validation status.
   */
  validatePasswordLengthOptions(e, t) {
    const r = this.customStrengthOptions.minPasswordLength, s = this.customStrengthOptions.maxPasswordLength;
    r && (t.meetsMinPasswordLength = e.length >= r), s && (t.meetsMaxPasswordLength = e.length <= s);
  }
  /**
   * Validates that the password meets the character options for the policy.
   *
   * @param password Password to validate.
   * @param status Validation status.
   */
  validatePasswordCharacterOptions(e, t) {
    this.updatePasswordCharacterOptionsStatuses(
      t,
      /* containsLowercaseCharacter= */
      !1,
      /* containsUppercaseCharacter= */
      !1,
      /* containsNumericCharacter= */
      !1,
      /* containsNonAlphanumericCharacter= */
      !1
    );
    let r;
    for (let s = 0; s < e.length; s++)
      r = e.charAt(s), this.updatePasswordCharacterOptionsStatuses(
        t,
        /* containsLowercaseCharacter= */
        r >= "a" && r <= "z",
        /* containsUppercaseCharacter= */
        r >= "A" && r <= "Z",
        /* containsNumericCharacter= */
        r >= "0" && r <= "9",
        /* containsNonAlphanumericCharacter= */
        this.allowedNonAlphanumericCharacters.includes(r)
      );
  }
  /**
   * Updates the running validation status with the statuses for the character options.
   * Expected to be called each time a character is processed to update each option status
   * based on the current character.
   *
   * @param status Validation status.
   * @param containsLowercaseCharacter Whether the character is a lowercase letter.
   * @param containsUppercaseCharacter Whether the character is an uppercase letter.
   * @param containsNumericCharacter Whether the character is a numeric character.
   * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
   */
  updatePasswordCharacterOptionsStatuses(e, t, r, s, o) {
    this.customStrengthOptions.containsLowercaseLetter && (e.containsLowercaseLetter || (e.containsLowercaseLetter = t)), this.customStrengthOptions.containsUppercaseLetter && (e.containsUppercaseLetter || (e.containsUppercaseLetter = r)), this.customStrengthOptions.containsNumericCharacter && (e.containsNumericCharacter || (e.containsNumericCharacter = s)), this.customStrengthOptions.containsNonAlphanumericCharacter && (e.containsNonAlphanumericCharacter || (e.containsNonAlphanumericCharacter = o));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class bp {
  constructor(e, t, r, s) {
    this.app = e, this.heartbeatServiceProvider = t, this.appCheckServiceProvider = r, this.config = s, this.currentUser = null, this.emulatorConfig = null, this.operations = Promise.resolve(), this.authStateSubscription = new rc(this), this.idTokenSubscription = new rc(this), this.beforeStateQueue = new Rp(this), this.redirectUser = null, this.isProactiveRefreshEnabled = !1, this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1, this._canInitEmulator = !0, this._isInitialized = !1, this._deleted = !1, this._initializationPromise = null, this._popupRedirectResolver = null, this._errorFactory = Pu, this._agentRecaptchaConfig = null, this._tenantRecaptchaConfigs = {}, this._projectPasswordPolicy = null, this._tenantPasswordPolicies = {}, this._resolvePersistenceManagerAvailable = void 0, this.lastNotifiedUid = void 0, this.languageCode = null, this.tenantId = null, this.settings = { appVerificationDisabledForTesting: !1 }, this.frameworks = [], this.name = e.name, this.clientVersion = s.sdkClientVersion, this._persistenceManagerAvailable = new Promise((o) => this._resolvePersistenceManagerAvailable = o);
  }
  _initializeWithPersistence(e, t) {
    return t && (this._popupRedirectResolver = Ke(t)), this._initializationPromise = this.queue(async () => {
      var r, s, o;
      if (!this._deleted && (this.persistenceManager = await Xt.create(this, e), (r = this._resolvePersistenceManagerAvailable) === null || r === void 0 || r.call(this), !this._deleted)) {
        if (!((s = this._popupRedirectResolver) === null || s === void 0) && s._shouldInitProactively)
          try {
            await this._popupRedirectResolver._initialize(this);
          } catch {
          }
        await this.initializeCurrentUser(t), this.lastNotifiedUid = ((o = this.currentUser) === null || o === void 0 ? void 0 : o.uid) || null, !this._deleted && (this._isInitialized = !0);
      }
    }), this._initializationPromise;
  }
  /**
   * If the persistence is changed in another window, the user manager will let us know
   */
  async _onStorageEvent() {
    if (this._deleted)
      return;
    const e = await this.assertedPersistence.getCurrentUser();
    if (!(!this.currentUser && !e)) {
      if (this.currentUser && e && this.currentUser.uid === e.uid) {
        this._currentUser._assign(e), await this.currentUser.getIdToken();
        return;
      }
      await this._updateCurrentUser(
        e,
        /* skipBeforeStateCallbacks */
        !0
      );
    }
  }
  async initializeCurrentUserFromIdToken(e) {
    try {
      const t = await Zr(this, { idToken: e }), r = await Ve._fromGetAccountInfoResponse(this, t, e);
      await this.directlySetCurrentUser(r);
    } catch (t) {
      console.warn("FirebaseServerApp could not login user with provided authIdToken: ", t), await this.directlySetCurrentUser(null);
    }
  }
  async initializeCurrentUser(e) {
    var t;
    if (ke(this.app)) {
      const a = this.app.settings.authIdToken;
      return a ? new Promise((u) => {
        setTimeout(() => this.initializeCurrentUserFromIdToken(a).then(u, u));
      }) : this.directlySetCurrentUser(null);
    }
    const r = await this.assertedPersistence.getCurrentUser();
    let s = r, o = !1;
    if (e && this.config.authDomain) {
      await this.getOrInitRedirectPersistenceManager();
      const a = (t = this.redirectUser) === null || t === void 0 ? void 0 : t._redirectEventId, u = s == null ? void 0 : s._redirectEventId, l = await this.tryRedirectSignIn(e);
      (!a || a === u) && (l != null && l.user) && (s = l.user, o = !0);
    }
    if (!s)
      return this.directlySetCurrentUser(null);
    if (!s._redirectEventId) {
      if (o)
        try {
          await this.beforeStateQueue.runMiddleware(s);
        } catch (a) {
          s = r, this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(a));
        }
      return s ? this.reloadAndSetCurrentUserOrClear(s) : this.directlySetCurrentUser(null);
    }
    return M(
      this._popupRedirectResolver,
      this,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    ), await this.getOrInitRedirectPersistenceManager(), this.redirectUser && this.redirectUser._redirectEventId === s._redirectEventId ? this.directlySetCurrentUser(s) : this.reloadAndSetCurrentUserOrClear(s);
  }
  async tryRedirectSignIn(e) {
    let t = null;
    try {
      t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
    } catch {
      await this._setRedirectUser(null);
    }
    return t;
  }
  async reloadAndSetCurrentUserOrClear(e) {
    try {
      await es(e);
    } catch (t) {
      if ((t == null ? void 0 : t.code) !== "auth/network-request-failed")
        return this.directlySetCurrentUser(null);
    }
    return this.directlySetCurrentUser(e);
  }
  useDeviceLanguage() {
    this.languageCode = ap();
  }
  async _delete() {
    this._deleted = !0;
  }
  async updateCurrentUser(e) {
    if (ke(this.app))
      return Promise.reject(pt(this));
    const t = e ? he(e) : null;
    return t && M(
      t.auth.config.apiKey === this.config.apiKey,
      this,
      "invalid-user-token"
      /* AuthErrorCode.INVALID_AUTH */
    ), this._updateCurrentUser(t && t._clone(this));
  }
  async _updateCurrentUser(e, t = !1) {
    if (!this._deleted)
      return e && M(
        this.tenantId === e.tenantId,
        this,
        "tenant-id-mismatch"
        /* AuthErrorCode.TENANT_ID_MISMATCH */
      ), t || await this.beforeStateQueue.runMiddleware(e), this.queue(async () => {
        await this.directlySetCurrentUser(e), this.notifyAuthListeners();
      });
  }
  async signOut() {
    return ke(this.app) ? Promise.reject(pt(this)) : (await this.beforeStateQueue.runMiddleware(null), (this.redirectPersistenceManager || this._popupRedirectResolver) && await this._setRedirectUser(null), this._updateCurrentUser(
      null,
      /* skipBeforeStateCallbacks */
      !0
    ));
  }
  setPersistence(e) {
    return ke(this.app) ? Promise.reject(pt(this)) : this.queue(async () => {
      await this.assertedPersistence.setPersistence(Ke(e));
    });
  }
  _getRecaptchaConfig() {
    return this.tenantId == null ? this._agentRecaptchaConfig : this._tenantRecaptchaConfigs[this.tenantId];
  }
  async validatePassword(e) {
    this._getPasswordPolicyInternal() || await this._updatePasswordPolicy();
    const t = this._getPasswordPolicyInternal();
    return t.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION ? Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {})) : t.validatePassword(e);
  }
  _getPasswordPolicyInternal() {
    return this.tenantId === null ? this._projectPasswordPolicy : this._tenantPasswordPolicies[this.tenantId];
  }
  async _updatePasswordPolicy() {
    const e = await Sp(this), t = new Cp(e);
    this.tenantId === null ? this._projectPasswordPolicy = t : this._tenantPasswordPolicies[this.tenantId] = t;
  }
  _getPersistenceType() {
    return this.assertedPersistence.persistence.type;
  }
  _getPersistence() {
    return this.assertedPersistence.persistence;
  }
  _updateErrorMap(e) {
    this._errorFactory = new rr("auth", "Firebase", e());
  }
  onAuthStateChanged(e, t, r) {
    return this.registerStateListener(this.authStateSubscription, e, t, r);
  }
  beforeAuthStateChanged(e, t) {
    return this.beforeStateQueue.pushCallback(e, t);
  }
  onIdTokenChanged(e, t, r) {
    return this.registerStateListener(this.idTokenSubscription, e, t, r);
  }
  authStateReady() {
    return new Promise((e, t) => {
      if (this.currentUser)
        e();
      else {
        const r = this.onAuthStateChanged(() => {
          r(), e();
        }, t);
      }
    });
  }
  /**
   * Revokes the given access token. Currently only supports Apple OAuth access tokens.
   */
  async revokeAccessToken(e) {
    if (this.currentUser) {
      const t = await this.currentUser.getIdToken(), r = {
        providerId: "apple.com",
        tokenType: "ACCESS_TOKEN",
        token: e,
        idToken: t
      };
      this.tenantId != null && (r.tenantId = this.tenantId), await Ip(this, r);
    }
  }
  toJSON() {
    var e;
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser: (e = this._currentUser) === null || e === void 0 ? void 0 : e.toJSON()
    };
  }
  async _setRedirectUser(e, t) {
    const r = await this.getOrInitRedirectPersistenceManager(t);
    return e === null ? r.removeCurrentUser() : r.setCurrentUser(e);
  }
  async getOrInitRedirectPersistenceManager(e) {
    if (!this.redirectPersistenceManager) {
      const t = e && Ke(e) || this._popupRedirectResolver;
      M(
        t,
        this,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      ), this.redirectPersistenceManager = await Xt.create(
        this,
        [Ke(t._redirectPersistence)],
        "redirectUser"
        /* KeyName.REDIRECT_USER */
      ), this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
    }
    return this.redirectPersistenceManager;
  }
  async _redirectUserForId(e) {
    var t, r;
    return this._isInitialized && await this.queue(async () => {
    }), ((t = this._currentUser) === null || t === void 0 ? void 0 : t._redirectEventId) === e ? this._currentUser : ((r = this.redirectUser) === null || r === void 0 ? void 0 : r._redirectEventId) === e ? this.redirectUser : null;
  }
  async _persistUserIfCurrent(e) {
    if (e === this.currentUser)
      return this.queue(async () => this.directlySetCurrentUser(e));
  }
  /** Notifies listeners only if the user is current */
  _notifyListenersIfCurrent(e) {
    e === this.currentUser && this.notifyAuthListeners();
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
  }
  _startProactiveRefresh() {
    this.isProactiveRefreshEnabled = !0, this.currentUser && this._currentUser._startProactiveRefresh();
  }
  _stopProactiveRefresh() {
    this.isProactiveRefreshEnabled = !1, this.currentUser && this._currentUser._stopProactiveRefresh();
  }
  /** Returns the current user cast as the internal type */
  get _currentUser() {
    return this.currentUser;
  }
  notifyAuthListeners() {
    var e, t;
    if (!this._isInitialized)
      return;
    this.idTokenSubscription.next(this.currentUser);
    const r = (t = (e = this.currentUser) === null || e === void 0 ? void 0 : e.uid) !== null && t !== void 0 ? t : null;
    this.lastNotifiedUid !== r && (this.lastNotifiedUid = r, this.authStateSubscription.next(this.currentUser));
  }
  registerStateListener(e, t, r, s) {
    if (this._deleted)
      return () => {
      };
    const o = typeof t == "function" ? t : t.next.bind(t);
    let a = !1;
    const u = this._isInitialized ? Promise.resolve() : this._initializationPromise;
    if (M(
      u,
      this,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), u.then(() => {
      a || o(this.currentUser);
    }), typeof t == "function") {
      const l = e.addObserver(t, r, s);
      return () => {
        a = !0, l();
      };
    } else {
      const l = e.addObserver(t);
      return () => {
        a = !0, l();
      };
    }
  }
  /**
   * Unprotected (from race conditions) method to set the current user. This
   * should only be called from within a queued callback. This is necessary
   * because the queue shouldn't rely on another queued callback.
   */
  async directlySetCurrentUser(e) {
    this.currentUser && this.currentUser !== e && this._currentUser._stopProactiveRefresh(), e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(), this.currentUser = e, e ? await this.assertedPersistence.setCurrentUser(e) : await this.assertedPersistence.removeCurrentUser();
  }
  queue(e) {
    return this.operations = this.operations.then(e, e), this.operations;
  }
  get assertedPersistence() {
    return M(
      this.persistenceManager,
      this,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), this.persistenceManager;
  }
  _logFramework(e) {
    !e || this.frameworks.includes(e) || (this.frameworks.push(e), this.frameworks.sort(), this.clientVersion = qu(this.config.clientPlatform, this._getFrameworks()));
  }
  _getFrameworks() {
    return this.frameworks;
  }
  async _getAdditionalHeaders() {
    var e;
    const t = {
      "X-Client-Version": this.clientVersion
    };
    this.app.options.appId && (t[
      "X-Firebase-gmpid"
      /* HttpHeader.X_FIREBASE_GMPID */
    ] = this.app.options.appId);
    const r = await ((e = this.heartbeatServiceProvider.getImmediate({
      optional: !0
    })) === null || e === void 0 ? void 0 : e.getHeartbeatsHeader());
    r && (t[
      "X-Firebase-Client"
      /* HttpHeader.X_FIREBASE_CLIENT */
    ] = r);
    const s = await this._getAppCheckToken();
    return s && (t[
      "X-Firebase-AppCheck"
      /* HttpHeader.X_FIREBASE_APP_CHECK */
    ] = s), t;
  }
  async _getAppCheckToken() {
    var e;
    if (ke(this.app) && this.app.settings.appCheckToken)
      return this.app.settings.appCheckToken;
    const t = await ((e = this.appCheckServiceProvider.getImmediate({ optional: !0 })) === null || e === void 0 ? void 0 : e.getToken());
    return t != null && t.error && sp(`Error while retrieving App Check token: ${t.error}`), t == null ? void 0 : t.token;
  }
}
function or(n) {
  return he(n);
}
class rc {
  constructor(e) {
    this.auth = e, this.observer = null, this.addObserver = zd((t) => this.observer = t);
  }
  get next() {
    return M(
      this.observer,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), this.observer.next.bind(this.observer);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let vs = {
  async loadJS() {
    throw new Error("Unable to load external scripts");
  },
  recaptchaV2Script: "",
  recaptchaEnterpriseScript: "",
  gapiScript: ""
};
function kp(n) {
  vs = n;
}
function $u(n) {
  return vs.loadJS(n);
}
function Vp() {
  return vs.recaptchaEnterpriseScript;
}
function Dp() {
  return vs.gapiScript;
}
function Np(n) {
  return `__${n}${Math.floor(Math.random() * 1e6)}`;
}
class Op {
  constructor() {
    this.enterprise = new Lp();
  }
  ready(e) {
    e();
  }
  execute(e, t) {
    return Promise.resolve("token");
  }
  render(e, t) {
    return "";
  }
}
class Lp {
  ready(e) {
    e();
  }
  execute(e, t) {
    return Promise.resolve("token");
  }
  render(e, t) {
    return "";
  }
}
const Mp = "recaptcha-enterprise", zu = "NO_RECAPTCHA";
class xp {
  /**
   *
   * @param authExtern - The corresponding Firebase {@link Auth} instance.
   *
   */
  constructor(e) {
    this.type = Mp, this.auth = or(e);
  }
  /**
   * Executes the verification process.
   *
   * @returns A Promise for a token that can be used to assert the validity of a request.
   */
  async verify(e = "verify", t = !1) {
    async function r(o) {
      if (!t) {
        if (o.tenantId == null && o._agentRecaptchaConfig != null)
          return o._agentRecaptchaConfig.siteKey;
        if (o.tenantId != null && o._tenantRecaptchaConfigs[o.tenantId] !== void 0)
          return o._tenantRecaptchaConfigs[o.tenantId].siteKey;
      }
      return new Promise(async (a, u) => {
        pp(o, {
          clientType: "CLIENT_TYPE_WEB",
          version: "RECAPTCHA_ENTERPRISE"
          /* RecaptchaVersion.ENTERPRISE */
        }).then((l) => {
          if (l.recaptchaKey === void 0)
            u(new Error("recaptcha Enterprise site key undefined"));
          else {
            const d = new fp(l);
            return o.tenantId == null ? o._agentRecaptchaConfig = d : o._tenantRecaptchaConfigs[o.tenantId] = d, a(d.siteKey);
          }
        }).catch((l) => {
          u(l);
        });
      });
    }
    function s(o, a, u) {
      const l = window.grecaptcha;
      Ya(l) ? l.enterprise.ready(() => {
        l.enterprise.execute(o, { action: e }).then((d) => {
          a(d);
        }).catch(() => {
          a(zu);
        });
      }) : u(Error("No reCAPTCHA enterprise script loaded."));
    }
    return this.auth.settings.appVerificationDisabledForTesting ? new Op().execute("siteKey", { action: "verify" }) : new Promise((o, a) => {
      r(this.auth).then((u) => {
        if (!t && Ya(window.grecaptcha))
          s(u, o, a);
        else {
          if (typeof window > "u") {
            a(new Error("RecaptchaVerifier is only supported in browser"));
            return;
          }
          let l = Vp();
          l.length !== 0 && (l += u), $u(l).then(() => {
            s(u, o, a);
          }).catch((d) => {
            a(d);
          });
        }
      }).catch((u) => {
        a(u);
      });
    });
  }
}
async function sc(n, e, t, r = !1, s = !1) {
  const o = new xp(n);
  let a;
  if (s)
    a = zu;
  else
    try {
      a = await o.verify(t);
    } catch {
      a = await o.verify(t, !0);
    }
  const u = Object.assign({}, e);
  if (t === "mfaSmsEnrollment" || t === "mfaSmsSignIn") {
    if ("phoneEnrollmentInfo" in u) {
      const l = u.phoneEnrollmentInfo.phoneNumber, d = u.phoneEnrollmentInfo.recaptchaToken;
      Object.assign(u, {
        phoneEnrollmentInfo: {
          phoneNumber: l,
          recaptchaToken: d,
          captchaResponse: a,
          clientType: "CLIENT_TYPE_WEB",
          recaptchaVersion: "RECAPTCHA_ENTERPRISE"
          /* RecaptchaVersion.ENTERPRISE */
        }
      });
    } else if ("phoneSignInInfo" in u) {
      const l = u.phoneSignInInfo.recaptchaToken;
      Object.assign(u, {
        phoneSignInInfo: {
          recaptchaToken: l,
          captchaResponse: a,
          clientType: "CLIENT_TYPE_WEB",
          recaptchaVersion: "RECAPTCHA_ENTERPRISE"
          /* RecaptchaVersion.ENTERPRISE */
        }
      });
    }
    return u;
  }
  return r ? Object.assign(u, { captchaResp: a }) : Object.assign(u, { captchaResponse: a }), Object.assign(u, {
    clientType: "CLIENT_TYPE_WEB"
    /* RecaptchaClientType.WEB */
  }), Object.assign(u, {
    recaptchaVersion: "RECAPTCHA_ENTERPRISE"
    /* RecaptchaVersion.ENTERPRISE */
  }), u;
}
async function ic(n, e, t, r, s) {
  var o;
  if (!((o = n._getRecaptchaConfig()) === null || o === void 0) && o.isProviderEnabled(
    "EMAIL_PASSWORD_PROVIDER"
    /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
  )) {
    const a = await sc(
      n,
      e,
      t,
      t === "getOobCode"
      /* RecaptchaActionName.GET_OOB_CODE */
    );
    return r(n, a);
  } else
    return r(n, e).catch(async (a) => {
      if (a.code === "auth/missing-recaptcha-token") {
        console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
        const u = await sc(
          n,
          e,
          t,
          t === "getOobCode"
          /* RecaptchaActionName.GET_OOB_CODE */
        );
        return r(n, u);
      } else
        return Promise.reject(a);
    });
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Up(n, e) {
  const t = Ki(n, "auth");
  if (t.isInitialized()) {
    const s = t.getImmediate(), o = t.getOptions();
    if (Nt(o, e ?? {}))
      return s;
    Oe(
      s,
      "already-initialized"
      /* AuthErrorCode.ALREADY_INITIALIZED */
    );
  }
  return t.initialize({ options: e });
}
function Fp(n, e) {
  const t = (e == null ? void 0 : e.persistence) || [], r = (Array.isArray(t) ? t : [t]).map(Ke);
  e != null && e.errorMap && n._updateErrorMap(e.errorMap), n._initializeWithPersistence(r, e == null ? void 0 : e.popupRedirectResolver);
}
function Hu(n, e, t) {
  const r = or(n);
  M(
    /^https?:\/\//.test(e),
    r,
    "invalid-emulator-scheme"
    /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
  );
  const s = !1, o = Wu(e), { host: a, port: u } = Bp(e), l = u === null ? "" : `:${u}`, d = { url: `${o}//${a}${l}/` }, p = Object.freeze({
    host: a,
    port: u,
    protocol: o.replace(":", ""),
    options: Object.freeze({ disableWarnings: s })
  });
  if (!r._canInitEmulator) {
    M(
      r.config.emulator && r.emulatorConfig,
      r,
      "emulator-config-failed"
      /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
    ), M(
      Nt(d, r.config.emulator) && Nt(p, r.emulatorConfig),
      r,
      "emulator-config-failed"
      /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
    );
    return;
  }
  r.config.emulator = d, r.emulatorConfig = p, r.settings.appVerificationDisabledForTesting = !0, jp();
}
function Wu(n) {
  const e = n.indexOf(":");
  return e < 0 ? "" : n.substr(0, e + 1);
}
function Bp(n) {
  const e = Wu(n), t = /(\/\/)?([^?#/]+)/.exec(n.substr(e.length));
  if (!t)
    return { host: "", port: null };
  const r = t[2].split("@").pop() || "", s = /^(\[[^\]]+\])(:|$)/.exec(r);
  if (s) {
    const o = s[1];
    return { host: o, port: oc(r.substr(o.length + 1)) };
  } else {
    const [o, a] = r.split(":");
    return { host: o, port: oc(a) };
  }
}
function oc(n) {
  if (!n)
    return null;
  const e = Number(n);
  return isNaN(e) ? null : e;
}
function jp() {
  function n() {
    const e = document.createElement("p"), t = e.style;
    e.innerText = "Running in emulator mode. Do not use with production credentials.", t.position = "fixed", t.width = "100%", t.backgroundColor = "#ffffff", t.border = ".1em solid #000000", t.color = "#b50000", t.bottom = "0px", t.left = "0px", t.margin = "0px", t.zIndex = "10000", t.textAlign = "center", e.classList.add("firebase-emulator-warning"), document.body.appendChild(e);
  }
  typeof console < "u" && typeof console.info == "function" && console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."), typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? window.addEventListener("DOMContentLoaded", n) : n());
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class eo {
  /** @internal */
  constructor(e, t) {
    this.providerId = e, this.signInMethod = t;
  }
  /**
   * Returns a JSON-serializable representation of this object.
   *
   * @returns a JSON-serializable representation of this object.
   */
  toJSON() {
    return We("not implemented");
  }
  /** @internal */
  _getIdTokenResponse(e) {
    return We("not implemented");
  }
  /** @internal */
  _linkToIdToken(e, t) {
    return We("not implemented");
  }
  /** @internal */
  _getReauthenticationResolver(e) {
    return We("not implemented");
  }
}
async function qp(n, e) {
  return wt(n, "POST", "/v1/accounts:signUp", e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function $p(n, e) {
  return ys(n, "POST", "/v1/accounts:signInWithPassword", Ut(n, e));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function zp(n, e) {
  return ys(n, "POST", "/v1/accounts:signInWithEmailLink", Ut(n, e));
}
async function Hp(n, e) {
  return ys(n, "POST", "/v1/accounts:signInWithEmailLink", Ut(n, e));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Jn extends eo {
  /** @internal */
  constructor(e, t, r, s = null) {
    super("password", r), this._email = e, this._password = t, this._tenantId = s;
  }
  /** @internal */
  static _fromEmailAndPassword(e, t) {
    return new Jn(
      e,
      t,
      "password"
      /* SignInMethod.EMAIL_PASSWORD */
    );
  }
  /** @internal */
  static _fromEmailAndCode(e, t, r = null) {
    return new Jn(e, t, "emailLink", r);
  }
  /** {@inheritdoc AuthCredential.toJSON} */
  toJSON() {
    return {
      email: this._email,
      password: this._password,
      signInMethod: this.signInMethod,
      tenantId: this._tenantId
    };
  }
  /**
   * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
   *
   * @param json - Either `object` or the stringified representation of the object. When string is
   * provided, `JSON.parse` would be called first.
   *
   * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
   */
  static fromJSON(e) {
    const t = typeof e == "string" ? JSON.parse(e) : e;
    if (t != null && t.email && (t != null && t.password)) {
      if (t.signInMethod === "password")
        return this._fromEmailAndPassword(t.email, t.password);
      if (t.signInMethod === "emailLink")
        return this._fromEmailAndCode(t.email, t.password, t.tenantId);
    }
    return null;
  }
  /** @internal */
  async _getIdTokenResponse(e) {
    switch (this.signInMethod) {
      case "password":
        const t = {
          returnSecureToken: !0,
          email: this._email,
          password: this._password,
          clientType: "CLIENT_TYPE_WEB"
          /* RecaptchaClientType.WEB */
        };
        return ic(e, t, "signInWithPassword", $p);
      case "emailLink":
        return zp(e, {
          email: this._email,
          oobCode: this._password
        });
      default:
        Oe(
          e,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
    }
  }
  /** @internal */
  async _linkToIdToken(e, t) {
    switch (this.signInMethod) {
      case "password":
        const r = {
          idToken: t,
          returnSecureToken: !0,
          email: this._email,
          password: this._password,
          clientType: "CLIENT_TYPE_WEB"
          /* RecaptchaClientType.WEB */
        };
        return ic(e, r, "signUpPassword", qp);
      case "emailLink":
        return Hp(e, {
          idToken: t,
          email: this._email,
          oobCode: this._password
        });
      default:
        Oe(
          e,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
    }
  }
  /** @internal */
  _getReauthenticationResolver(e) {
    return this._getIdTokenResponse(e);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Yt(n, e) {
  return ys(n, "POST", "/v1/accounts:signInWithIdp", Ut(n, e));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Wp = "http://localhost";
class Lt extends eo {
  constructor() {
    super(...arguments), this.pendingToken = null;
  }
  /** @internal */
  static _fromParams(e) {
    const t = new Lt(e.providerId, e.signInMethod);
    return e.idToken || e.accessToken ? (e.idToken && (t.idToken = e.idToken), e.accessToken && (t.accessToken = e.accessToken), e.nonce && !e.pendingToken && (t.nonce = e.nonce), e.pendingToken && (t.pendingToken = e.pendingToken)) : e.oauthToken && e.oauthTokenSecret ? (t.accessToken = e.oauthToken, t.secret = e.oauthTokenSecret) : Oe(
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    ), t;
  }
  /** {@inheritdoc AuthCredential.toJSON}  */
  toJSON() {
    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      secret: this.secret,
      nonce: this.nonce,
      pendingToken: this.pendingToken,
      providerId: this.providerId,
      signInMethod: this.signInMethod
    };
  }
  /**
   * Static method to deserialize a JSON representation of an object into an
   * {@link  AuthCredential}.
   *
   * @param json - Input can be either Object or the stringified representation of the object.
   * When string is provided, JSON.parse would be called first.
   *
   * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
   */
  static fromJSON(e) {
    const t = typeof e == "string" ? JSON.parse(e) : e, { providerId: r, signInMethod: s } = t, o = Qi(t, ["providerId", "signInMethod"]);
    if (!r || !s)
      return null;
    const a = new Lt(r, s);
    return a.idToken = o.idToken || void 0, a.accessToken = o.accessToken || void 0, a.secret = o.secret, a.nonce = o.nonce, a.pendingToken = o.pendingToken || null, a;
  }
  /** @internal */
  _getIdTokenResponse(e) {
    const t = this.buildRequest();
    return Yt(e, t);
  }
  /** @internal */
  _linkToIdToken(e, t) {
    const r = this.buildRequest();
    return r.idToken = t, Yt(e, r);
  }
  /** @internal */
  _getReauthenticationResolver(e) {
    const t = this.buildRequest();
    return t.autoCreate = !1, Yt(e, t);
  }
  buildRequest() {
    const e = {
      requestUri: Wp,
      returnSecureToken: !0
    };
    if (this.pendingToken)
      e.pendingToken = this.pendingToken;
    else {
      const t = {};
      this.idToken && (t.id_token = this.idToken), this.accessToken && (t.access_token = this.accessToken), this.secret && (t.oauth_token_secret = this.secret), t.providerId = this.providerId, this.nonce && !this.pendingToken && (t.nonce = this.nonce), e.postBody = sr(t);
    }
    return e;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Kp(n) {
  switch (n) {
    case "recoverEmail":
      return "RECOVER_EMAIL";
    case "resetPassword":
      return "PASSWORD_RESET";
    case "signIn":
      return "EMAIL_SIGNIN";
    case "verifyEmail":
      return "VERIFY_EMAIL";
    case "verifyAndChangeEmail":
      return "VERIFY_AND_CHANGE_EMAIL";
    case "revertSecondFactorAddition":
      return "REVERT_SECOND_FACTOR_ADDITION";
    default:
      return null;
  }
}
function Gp(n) {
  const e = Mn(xn(n)).link, t = e ? Mn(xn(e)).deep_link_id : null, r = Mn(xn(n)).deep_link_id;
  return (r ? Mn(xn(r)).link : null) || r || t || e || n;
}
class Es {
  /**
   * @param actionLink - The link from which to extract the URL.
   * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
   *
   * @internal
   */
  constructor(e) {
    var t, r, s, o, a, u;
    const l = Mn(xn(e)), d = (t = l.apiKey) !== null && t !== void 0 ? t : null, p = (r = l.oobCode) !== null && r !== void 0 ? r : null, y = Kp((s = l.mode) !== null && s !== void 0 ? s : null);
    M(
      d && p && y,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    ), this.apiKey = d, this.operation = y, this.code = p, this.continueUrl = (o = l.continueUrl) !== null && o !== void 0 ? o : null, this.languageCode = (a = l.languageCode) !== null && a !== void 0 ? a : null, this.tenantId = (u = l.tenantId) !== null && u !== void 0 ? u : null;
  }
  /**
   * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
   * otherwise returns null.
   *
   * @param link  - The email action link string.
   * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
   *
   * @public
   */
  static parseLink(e) {
    const t = Gp(e);
    try {
      return new Es(t);
    } catch {
      return null;
    }
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fn {
  constructor() {
    this.providerId = fn.PROVIDER_ID;
  }
  /**
   * Initialize an {@link AuthCredential} using an email and password.
   *
   * @example
   * ```javascript
   * const authCredential = EmailAuthProvider.credential(email, password);
   * const userCredential = await signInWithCredential(auth, authCredential);
   * ```
   *
   * @example
   * ```javascript
   * const userCredential = await signInWithEmailAndPassword(auth, email, password);
   * ```
   *
   * @param email - Email address.
   * @param password - User account password.
   * @returns The auth provider credential.
   */
  static credential(e, t) {
    return Jn._fromEmailAndPassword(e, t);
  }
  /**
   * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
   * email link operation.
   *
   * @example
   * ```javascript
   * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
   * const userCredential = await signInWithCredential(auth, authCredential);
   * ```
   *
   * @example
   * ```javascript
   * await sendSignInLinkToEmail(auth, email);
   * // Obtain emailLink from user.
   * const userCredential = await signInWithEmailLink(auth, email, emailLink);
   * ```
   *
   * @param auth - The {@link Auth} instance used to verify the link.
   * @param email - Email address.
   * @param emailLink - Sign-in email link.
   * @returns - The auth provider credential.
   */
  static credentialWithLink(e, t) {
    const r = Es.parseLink(t);
    return M(
      r,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    ), Jn._fromEmailAndCode(e, r.code, r.tenantId);
  }
}
fn.PROVIDER_ID = "password";
fn.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
fn.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ku {
  /**
   * Constructor for generic OAuth providers.
   *
   * @param providerId - Provider for which credentials should be generated.
   */
  constructor(e) {
    this.providerId = e, this.defaultLanguageCode = null, this.customParameters = {};
  }
  /**
   * Set the language gode.
   *
   * @param languageCode - language code
   */
  setDefaultLanguage(e) {
    this.defaultLanguageCode = e;
  }
  /**
   * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
   * operations.
   *
   * @remarks
   * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
   * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
   *
   * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
   */
  setCustomParameters(e) {
    return this.customParameters = e, this;
  }
  /**
   * Retrieve the current list of {@link CustomParameters}.
   */
  getCustomParameters() {
    return this.customParameters;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ar extends Ku {
  constructor() {
    super(...arguments), this.scopes = [];
  }
  /**
   * Add an OAuth scope to the credential.
   *
   * @param scope - Provider OAuth scope to add.
   */
  addScope(e) {
    return this.scopes.includes(e) || this.scopes.push(e), this;
  }
  /**
   * Retrieve the current list of OAuth scopes.
   */
  getScopes() {
    return [...this.scopes];
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ot extends ar {
  constructor() {
    super(
      "facebook.com"
      /* ProviderId.FACEBOOK */
    );
  }
  /**
   * Creates a credential for Facebook.
   *
   * @example
   * ```javascript
   * // `event` from the Facebook auth.authResponseChange callback.
   * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
   * const result = await signInWithCredential(credential);
   * ```
   *
   * @param accessToken - Facebook access token.
   */
  static credential(e) {
    return Lt._fromParams({
      providerId: ot.PROVIDER_ID,
      signInMethod: ot.FACEBOOK_SIGN_IN_METHOD,
      accessToken: e
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(e) {
    return ot.credentialFromTaggedObject(e);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(e) {
    return ot.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e || !("oauthAccessToken" in e) || !e.oauthAccessToken)
      return null;
    try {
      return ot.credential(e.oauthAccessToken);
    } catch {
      return null;
    }
  }
}
ot.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
ot.PROVIDER_ID = "facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class at extends ar {
  constructor() {
    super(
      "google.com"
      /* ProviderId.GOOGLE */
    ), this.addScope("profile");
  }
  /**
   * Creates a credential for Google. At least one of ID token and access token is required.
   *
   * @example
   * ```javascript
   * // \`googleUser\` from the onsuccess Google Sign In callback.
   * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
   * const result = await signInWithCredential(credential);
   * ```
   *
   * @param idToken - Google ID token.
   * @param accessToken - Google access token.
   */
  static credential(e, t) {
    return Lt._fromParams({
      providerId: at.PROVIDER_ID,
      signInMethod: at.GOOGLE_SIGN_IN_METHOD,
      idToken: e,
      accessToken: t
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(e) {
    return at.credentialFromTaggedObject(e);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(e) {
    return at.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e)
      return null;
    const { oauthIdToken: t, oauthAccessToken: r } = e;
    if (!t && !r)
      return null;
    try {
      return at.credential(t, r);
    } catch {
      return null;
    }
  }
}
at.GOOGLE_SIGN_IN_METHOD = "google.com";
at.PROVIDER_ID = "google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ct extends ar {
  constructor() {
    super(
      "github.com"
      /* ProviderId.GITHUB */
    );
  }
  /**
   * Creates a credential for GitHub.
   *
   * @param accessToken - GitHub access token.
   */
  static credential(e) {
    return Lt._fromParams({
      providerId: ct.PROVIDER_ID,
      signInMethod: ct.GITHUB_SIGN_IN_METHOD,
      accessToken: e
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(e) {
    return ct.credentialFromTaggedObject(e);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(e) {
    return ct.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e || !("oauthAccessToken" in e) || !e.oauthAccessToken)
      return null;
    try {
      return ct.credential(e.oauthAccessToken);
    } catch {
      return null;
    }
  }
}
ct.GITHUB_SIGN_IN_METHOD = "github.com";
ct.PROVIDER_ID = "github.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ut extends ar {
  constructor() {
    super(
      "twitter.com"
      /* ProviderId.TWITTER */
    );
  }
  /**
   * Creates a credential for Twitter.
   *
   * @param token - Twitter access token.
   * @param secret - Twitter secret.
   */
  static credential(e, t) {
    return Lt._fromParams({
      providerId: ut.PROVIDER_ID,
      signInMethod: ut.TWITTER_SIGN_IN_METHOD,
      oauthToken: e,
      oauthTokenSecret: t
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(e) {
    return ut.credentialFromTaggedObject(e);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(e) {
    return ut.credentialFromTaggedObject(e.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: e }) {
    if (!e)
      return null;
    const { oauthAccessToken: t, oauthTokenSecret: r } = e;
    if (!t || !r)
      return null;
    try {
      return ut.credential(t, r);
    } catch {
      return null;
    }
  }
}
ut.TWITTER_SIGN_IN_METHOD = "twitter.com";
ut.PROVIDER_ID = "twitter.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class tn {
  constructor(e) {
    this.user = e.user, this.providerId = e.providerId, this._tokenResponse = e._tokenResponse, this.operationType = e.operationType;
  }
  static async _fromIdTokenResponse(e, t, r, s = !1) {
    const o = await Ve._fromIdTokenResponse(e, r, s), a = ac(r);
    return new tn({
      user: o,
      providerId: a,
      _tokenResponse: r,
      operationType: t
    });
  }
  static async _forOperation(e, t, r) {
    await e._updateTokensIfNecessary(
      r,
      /* reload */
      !0
    );
    const s = ac(r);
    return new tn({
      user: e,
      providerId: s,
      _tokenResponse: r,
      operationType: t
    });
  }
}
function ac(n) {
  return n.providerId ? n.providerId : "phoneNumber" in n ? "phone" : null;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ts extends et {
  constructor(e, t, r, s) {
    var o;
    super(t.code, t.message), this.operationType = r, this.user = s, Object.setPrototypeOf(this, ts.prototype), this.customData = {
      appName: e.name,
      tenantId: (o = e.tenantId) !== null && o !== void 0 ? o : void 0,
      _serverResponse: t.customData._serverResponse,
      operationType: r
    };
  }
  static _fromErrorAndOperation(e, t, r, s) {
    return new ts(e, t, r, s);
  }
}
function Gu(n, e, t, r) {
  return (e === "reauthenticate" ? t._getReauthenticationResolver(n) : t._getIdTokenResponse(n)).catch((o) => {
    throw o.code === "auth/multi-factor-auth-required" ? ts._fromErrorAndOperation(n, o, e, r) : o;
  });
}
async function Qp(n, e, t = !1) {
  const r = await Qn(n, e._linkToIdToken(n.auth, await n.getIdToken()), t);
  return tn._forOperation(n, "link", r);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Jp(n, e, t = !1) {
  const { auth: r } = n;
  if (ke(r.app))
    return Promise.reject(pt(r));
  const s = "reauthenticate";
  try {
    const o = await Qn(n, Gu(r, s, e, n), t);
    M(
      o.idToken,
      r,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const a = Yi(o.idToken);
    M(
      a,
      r,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const { sub: u } = a;
    return M(
      n.uid === u,
      r,
      "user-mismatch"
      /* AuthErrorCode.USER_MISMATCH */
    ), tn._forOperation(n, s, o);
  } catch (o) {
    throw (o == null ? void 0 : o.code) === "auth/user-not-found" && Oe(
      r,
      "user-mismatch"
      /* AuthErrorCode.USER_MISMATCH */
    ), o;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Qu(n, e, t = !1) {
  if (ke(n.app))
    return Promise.reject(pt(n));
  const r = "signIn", s = await Gu(n, r, e), o = await tn._fromIdTokenResponse(n, r, s);
  return t || await n._updateCurrentUser(o.user), o;
}
async function Xp(n, e) {
  return Qu(or(n), e);
}
function Yp(n, e) {
  const t = Es.parseLink(e);
  return (t == null ? void 0 : t.operation) === "EMAIL_SIGNIN";
}
async function Zp(n, e, t) {
  if (ke(n.app))
    return Promise.reject(pt(n));
  const r = he(n), s = fn.credentialWithLink(e, t || Yr());
  return M(
    s._tenantId === (r.tenantId || null),
    r,
    "tenant-id-mismatch"
    /* AuthErrorCode.TENANT_ID_MISMATCH */
  ), Xp(r, s);
}
function em(n, e, t, r) {
  return he(n).onIdTokenChanged(e, t, r);
}
function tm(n, e, t) {
  return he(n).beforeAuthStateChanged(e, t);
}
function nm(n, e, t, r) {
  return he(n).onAuthStateChanged(e, t, r);
}
function cc(n) {
  return he(n).signOut();
}
const ns = "__sak";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ju {
  constructor(e, t) {
    this.storageRetriever = e, this.type = t;
  }
  _isAvailable() {
    try {
      return this.storage ? (this.storage.setItem(ns, "1"), this.storage.removeItem(ns), Promise.resolve(!0)) : Promise.resolve(!1);
    } catch {
      return Promise.resolve(!1);
    }
  }
  _set(e, t) {
    return this.storage.setItem(e, JSON.stringify(t)), Promise.resolve();
  }
  _get(e) {
    const t = this.storage.getItem(e);
    return Promise.resolve(t ? JSON.parse(t) : null);
  }
  _remove(e) {
    return this.storage.removeItem(e), Promise.resolve();
  }
  get storage() {
    return this.storageRetriever();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const rm = 1e3, sm = 10;
class Xu extends Ju {
  constructor() {
    super(
      () => window.localStorage,
      "LOCAL"
      /* PersistenceType.LOCAL */
    ), this.boundEventHandler = (e, t) => this.onStorageEvent(e, t), this.listeners = {}, this.localCache = {}, this.pollTimer = null, this.fallbackToPolling = ju(), this._shouldAllowMigration = !0;
  }
  forAllChangedKeys(e) {
    for (const t of Object.keys(this.listeners)) {
      const r = this.storage.getItem(t), s = this.localCache[t];
      r !== s && e(t, s, r);
    }
  }
  onStorageEvent(e, t = !1) {
    if (!e.key) {
      this.forAllChangedKeys((a, u, l) => {
        this.notifyListeners(a, l);
      });
      return;
    }
    const r = e.key;
    t ? this.detachListener() : this.stopPolling();
    const s = () => {
      const a = this.storage.getItem(r);
      !t && this.localCache[r] === a || this.notifyListeners(r, a);
    }, o = this.storage.getItem(r);
    Ap() && o !== e.newValue && e.newValue !== e.oldValue ? setTimeout(s, sm) : s();
  }
  notifyListeners(e, t) {
    this.localCache[e] = t;
    const r = this.listeners[e];
    if (r)
      for (const s of Array.from(r))
        s(t && JSON.parse(t));
  }
  startPolling() {
    this.stopPolling(), this.pollTimer = setInterval(() => {
      this.forAllChangedKeys((e, t, r) => {
        this.onStorageEvent(
          new StorageEvent("storage", {
            key: e,
            oldValue: t,
            newValue: r
          }),
          /* poll */
          !0
        );
      });
    }, rm);
  }
  stopPolling() {
    this.pollTimer && (clearInterval(this.pollTimer), this.pollTimer = null);
  }
  attachListener() {
    window.addEventListener("storage", this.boundEventHandler);
  }
  detachListener() {
    window.removeEventListener("storage", this.boundEventHandler);
  }
  _addListener(e, t) {
    Object.keys(this.listeners).length === 0 && (this.fallbackToPolling ? this.startPolling() : this.attachListener()), this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set(), this.localCache[e] = this.storage.getItem(e)), this.listeners[e].add(t);
  }
  _removeListener(e, t) {
    this.listeners[e] && (this.listeners[e].delete(t), this.listeners[e].size === 0 && delete this.listeners[e]), Object.keys(this.listeners).length === 0 && (this.detachListener(), this.stopPolling());
  }
  // Update local cache on base operations:
  async _set(e, t) {
    await super._set(e, t), this.localCache[e] = JSON.stringify(t);
  }
  async _get(e) {
    const t = await super._get(e);
    return this.localCache[e] = JSON.stringify(t), t;
  }
  async _remove(e) {
    await super._remove(e), delete this.localCache[e];
  }
}
Xu.type = "LOCAL";
const im = Xu;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Yu extends Ju {
  constructor() {
    super(
      () => window.sessionStorage,
      "SESSION"
      /* PersistenceType.SESSION */
    );
  }
  _addListener(e, t) {
  }
  _removeListener(e, t) {
  }
}
Yu.type = "SESSION";
const Zu = Yu;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function om(n) {
  return Promise.all(n.map(async (e) => {
    try {
      return {
        fulfilled: !0,
        value: await e
      };
    } catch (t) {
      return {
        fulfilled: !1,
        reason: t
      };
    }
  }));
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ts {
  constructor(e) {
    this.eventTarget = e, this.handlersMap = {}, this.boundEventHandler = this.handleEvent.bind(this);
  }
  /**
   * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
   *
   * @param eventTarget - An event target (such as window or self) through which the underlying
   * messages will be received.
   */
  static _getInstance(e) {
    const t = this.receivers.find((s) => s.isListeningto(e));
    if (t)
      return t;
    const r = new Ts(e);
    return this.receivers.push(r), r;
  }
  isListeningto(e) {
    return this.eventTarget === e;
  }
  /**
   * Fans out a MessageEvent to the appropriate listeners.
   *
   * @remarks
   * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
   * finished processing.
   *
   * @param event - The MessageEvent.
   *
   */
  async handleEvent(e) {
    const t = e, { eventId: r, eventType: s, data: o } = t.data, a = this.handlersMap[s];
    if (!(a != null && a.size))
      return;
    t.ports[0].postMessage({
      status: "ack",
      eventId: r,
      eventType: s
    });
    const u = Array.from(a).map(async (d) => d(t.origin, o)), l = await om(u);
    t.ports[0].postMessage({
      status: "done",
      eventId: r,
      eventType: s,
      response: l
    });
  }
  /**
   * Subscribe an event handler for a particular event.
   *
   * @param eventType - Event name to subscribe to.
   * @param eventHandler - The event handler which should receive the events.
   *
   */
  _subscribe(e, t) {
    Object.keys(this.handlersMap).length === 0 && this.eventTarget.addEventListener("message", this.boundEventHandler), this.handlersMap[e] || (this.handlersMap[e] = /* @__PURE__ */ new Set()), this.handlersMap[e].add(t);
  }
  /**
   * Unsubscribe an event handler from a particular event.
   *
   * @param eventType - Event name to unsubscribe from.
   * @param eventHandler - Optional event handler, if none provided, unsubscribe all handlers on this event.
   *
   */
  _unsubscribe(e, t) {
    this.handlersMap[e] && t && this.handlersMap[e].delete(t), (!t || this.handlersMap[e].size === 0) && delete this.handlersMap[e], Object.keys(this.handlersMap).length === 0 && this.eventTarget.removeEventListener("message", this.boundEventHandler);
  }
}
Ts.receivers = [];
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function to(n = "", e = 10) {
  let t = "";
  for (let r = 0; r < e; r++)
    t += Math.floor(Math.random() * 10);
  return n + t;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class am {
  constructor(e) {
    this.target = e, this.handlers = /* @__PURE__ */ new Set();
  }
  /**
   * Unsubscribe the handler and remove it from our tracking Set.
   *
   * @param handler - The handler to unsubscribe.
   */
  removeMessageHandler(e) {
    e.messageChannel && (e.messageChannel.port1.removeEventListener("message", e.onMessage), e.messageChannel.port1.close()), this.handlers.delete(e);
  }
  /**
   * Send a message to the Receiver located at {@link target}.
   *
   * @remarks
   * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
   * receiver has had a chance to fully process the event.
   *
   * @param eventType - Type of event to send.
   * @param data - The payload of the event.
   * @param timeout - Timeout for waiting on an ACK from the receiver.
   *
   * @returns An array of settled promises from all the handlers that were listening on the receiver.
   */
  async _send(e, t, r = 50) {
    const s = typeof MessageChannel < "u" ? new MessageChannel() : null;
    if (!s)
      throw new Error(
        "connection_unavailable"
        /* _MessageError.CONNECTION_UNAVAILABLE */
      );
    let o, a;
    return new Promise((u, l) => {
      const d = to("", 20);
      s.port1.start();
      const p = setTimeout(() => {
        l(new Error(
          "unsupported_event"
          /* _MessageError.UNSUPPORTED_EVENT */
        ));
      }, r);
      a = {
        messageChannel: s,
        onMessage(y) {
          const w = y;
          if (w.data.eventId === d)
            switch (w.data.status) {
              case "ack":
                clearTimeout(p), o = setTimeout(
                  () => {
                    l(new Error(
                      "timeout"
                      /* _MessageError.TIMEOUT */
                    ));
                  },
                  3e3
                  /* _TimeoutDuration.COMPLETION */
                );
                break;
              case "done":
                clearTimeout(o), u(w.data.response);
                break;
              default:
                clearTimeout(p), clearTimeout(o), l(new Error(
                  "invalid_response"
                  /* _MessageError.INVALID_RESPONSE */
                ));
                break;
            }
        }
      }, this.handlers.add(a), s.port1.addEventListener("message", a.onMessage), this.target.postMessage({
        eventType: e,
        eventId: d,
        data: t
      }, [s.port2]);
    }).finally(() => {
      a && this.removeMessageHandler(a);
    });
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function xe() {
  return window;
}
function cm(n) {
  xe().location.href = n;
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function el() {
  return typeof xe().WorkerGlobalScope < "u" && typeof xe().importScripts == "function";
}
async function um() {
  if (!(navigator != null && navigator.serviceWorker))
    return null;
  try {
    return (await navigator.serviceWorker.ready).active;
  } catch {
    return null;
  }
}
function lm() {
  var n;
  return ((n = navigator == null ? void 0 : navigator.serviceWorker) === null || n === void 0 ? void 0 : n.controller) || null;
}
function hm() {
  return el() ? self : null;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tl = "firebaseLocalStorageDb", dm = 1, rs = "firebaseLocalStorage", nl = "fbase_key";
class cr {
  constructor(e) {
    this.request = e;
  }
  toPromise() {
    return new Promise((e, t) => {
      this.request.addEventListener("success", () => {
        e(this.request.result);
      }), this.request.addEventListener("error", () => {
        t(this.request.error);
      });
    });
  }
}
function Is(n, e) {
  return n.transaction([rs], e ? "readwrite" : "readonly").objectStore(rs);
}
function fm() {
  const n = indexedDB.deleteDatabase(tl);
  return new cr(n).toPromise();
}
function Pi() {
  const n = indexedDB.open(tl, dm);
  return new Promise((e, t) => {
    n.addEventListener("error", () => {
      t(n.error);
    }), n.addEventListener("upgradeneeded", () => {
      const r = n.result;
      try {
        r.createObjectStore(rs, { keyPath: nl });
      } catch (s) {
        t(s);
      }
    }), n.addEventListener("success", async () => {
      const r = n.result;
      r.objectStoreNames.contains(rs) ? e(r) : (r.close(), await fm(), e(await Pi()));
    });
  });
}
async function uc(n, e, t) {
  const r = Is(n, !0).put({
    [nl]: e,
    value: t
  });
  return new cr(r).toPromise();
}
async function pm(n, e) {
  const t = Is(n, !1).get(e), r = await new cr(t).toPromise();
  return r === void 0 ? null : r.value;
}
function lc(n, e) {
  const t = Is(n, !0).delete(e);
  return new cr(t).toPromise();
}
const mm = 800, gm = 3;
class rl {
  constructor() {
    this.type = "LOCAL", this._shouldAllowMigration = !0, this.listeners = {}, this.localCache = {}, this.pollTimer = null, this.pendingWrites = 0, this.receiver = null, this.sender = null, this.serviceWorkerReceiverAvailable = !1, this.activeServiceWorker = null, this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
    }, () => {
    });
  }
  async _openDb() {
    return this.db ? this.db : (this.db = await Pi(), this.db);
  }
  async _withRetries(e) {
    let t = 0;
    for (; ; )
      try {
        const r = await this._openDb();
        return await e(r);
      } catch (r) {
        if (t++ > gm)
          throw r;
        this.db && (this.db.close(), this.db = void 0);
      }
  }
  /**
   * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
   * postMessage interface to send these events to the worker ourselves.
   */
  async initializeServiceWorkerMessaging() {
    return el() ? this.initializeReceiver() : this.initializeSender();
  }
  /**
   * As the worker we should listen to events from the main window.
   */
  async initializeReceiver() {
    this.receiver = Ts._getInstance(hm()), this.receiver._subscribe("keyChanged", async (e, t) => ({
      keyProcessed: (await this._poll()).includes(t.key)
    })), this.receiver._subscribe("ping", async (e, t) => [
      "keyChanged"
      /* _EventType.KEY_CHANGED */
    ]);
  }
  /**
   * As the main window, we should let the worker know when keys change (set and remove).
   *
   * @remarks
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
   * may not resolve.
   */
  async initializeSender() {
    var e, t;
    if (this.activeServiceWorker = await um(), !this.activeServiceWorker)
      return;
    this.sender = new am(this.activeServiceWorker);
    const r = await this.sender._send(
      "ping",
      {},
      800
      /* _TimeoutDuration.LONG_ACK */
    );
    r && !((e = r[0]) === null || e === void 0) && e.fulfilled && !((t = r[0]) === null || t === void 0) && t.value.includes(
      "keyChanged"
      /* _EventType.KEY_CHANGED */
    ) && (this.serviceWorkerReceiverAvailable = !0);
  }
  /**
   * Let the worker know about a changed key, the exact key doesn't technically matter since the
   * worker will just trigger a full sync anyway.
   *
   * @remarks
   * For now, we only support one service worker per page.
   *
   * @param key - Storage key which changed.
   */
  async notifyServiceWorker(e) {
    if (!(!this.sender || !this.activeServiceWorker || lm() !== this.activeServiceWorker))
      try {
        await this.sender._send(
          "keyChanged",
          { key: e },
          // Use long timeout if receiver has previously responded to a ping from us.
          this.serviceWorkerReceiverAvailable ? 800 : 50
          /* _TimeoutDuration.ACK */
        );
      } catch {
      }
  }
  async _isAvailable() {
    try {
      if (!indexedDB)
        return !1;
      const e = await Pi();
      return await uc(e, ns, "1"), await lc(e, ns), !0;
    } catch {
    }
    return !1;
  }
  async _withPendingWrite(e) {
    this.pendingWrites++;
    try {
      await e();
    } finally {
      this.pendingWrites--;
    }
  }
  async _set(e, t) {
    return this._withPendingWrite(async () => (await this._withRetries((r) => uc(r, e, t)), this.localCache[e] = t, this.notifyServiceWorker(e)));
  }
  async _get(e) {
    const t = await this._withRetries((r) => pm(r, e));
    return this.localCache[e] = t, t;
  }
  async _remove(e) {
    return this._withPendingWrite(async () => (await this._withRetries((t) => lc(t, e)), delete this.localCache[e], this.notifyServiceWorker(e)));
  }
  async _poll() {
    const e = await this._withRetries((s) => {
      const o = Is(s, !1).getAll();
      return new cr(o).toPromise();
    });
    if (!e)
      return [];
    if (this.pendingWrites !== 0)
      return [];
    const t = [], r = /* @__PURE__ */ new Set();
    if (e.length !== 0)
      for (const { fbase_key: s, value: o } of e)
        r.add(s), JSON.stringify(this.localCache[s]) !== JSON.stringify(o) && (this.notifyListeners(s, o), t.push(s));
    for (const s of Object.keys(this.localCache))
      this.localCache[s] && !r.has(s) && (this.notifyListeners(s, null), t.push(s));
    return t;
  }
  notifyListeners(e, t) {
    this.localCache[e] = t;
    const r = this.listeners[e];
    if (r)
      for (const s of Array.from(r))
        s(t);
  }
  startPolling() {
    this.stopPolling(), this.pollTimer = setInterval(async () => this._poll(), mm);
  }
  stopPolling() {
    this.pollTimer && (clearInterval(this.pollTimer), this.pollTimer = null);
  }
  _addListener(e, t) {
    Object.keys(this.listeners).length === 0 && this.startPolling(), this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set(), this._get(e)), this.listeners[e].add(t);
  }
  _removeListener(e, t) {
    this.listeners[e] && (this.listeners[e].delete(t), this.listeners[e].size === 0 && delete this.listeners[e]), Object.keys(this.listeners).length === 0 && this.stopPolling();
  }
}
rl.type = "LOCAL";
const _m = rl;
new ir(3e4, 6e4);
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ym(n, e) {
  return e ? Ke(e) : (M(
    n._popupRedirectResolver,
    n,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  ), n._popupRedirectResolver);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class no extends eo {
  constructor(e) {
    super(
      "custom",
      "custom"
      /* ProviderId.CUSTOM */
    ), this.params = e;
  }
  _getIdTokenResponse(e) {
    return Yt(e, this._buildIdpRequest());
  }
  _linkToIdToken(e, t) {
    return Yt(e, this._buildIdpRequest(t));
  }
  _getReauthenticationResolver(e) {
    return Yt(e, this._buildIdpRequest());
  }
  _buildIdpRequest(e) {
    const t = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: !0,
      returnIdpCredential: !0
    };
    return e && (t.idToken = e), t;
  }
}
function vm(n) {
  return Qu(n.auth, new no(n), n.bypassAuthState);
}
function Em(n) {
  const { auth: e, user: t } = n;
  return M(
    t,
    e,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  ), Jp(t, new no(n), n.bypassAuthState);
}
async function Tm(n) {
  const { auth: e, user: t } = n;
  return M(
    t,
    e,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  ), Qp(t, new no(n), n.bypassAuthState);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class sl {
  constructor(e, t, r, s, o = !1) {
    this.auth = e, this.resolver = r, this.user = s, this.bypassAuthState = o, this.pendingPromise = null, this.eventManager = null, this.filter = Array.isArray(t) ? t : [t];
  }
  execute() {
    return new Promise(async (e, t) => {
      this.pendingPromise = { resolve: e, reject: t };
      try {
        this.eventManager = await this.resolver._initialize(this.auth), await this.onExecution(), this.eventManager.registerConsumer(this);
      } catch (r) {
        this.reject(r);
      }
    });
  }
  async onAuthEvent(e) {
    const { urlResponse: t, sessionId: r, postBody: s, tenantId: o, error: a, type: u } = e;
    if (a) {
      this.reject(a);
      return;
    }
    const l = {
      auth: this.auth,
      requestUri: t,
      sessionId: r,
      tenantId: o || void 0,
      postBody: s || void 0,
      user: this.user,
      bypassAuthState: this.bypassAuthState
    };
    try {
      this.resolve(await this.getIdpTask(u)(l));
    } catch (d) {
      this.reject(d);
    }
  }
  onError(e) {
    this.reject(e);
  }
  getIdpTask(e) {
    switch (e) {
      case "signInViaPopup":
      case "signInViaRedirect":
        return vm;
      case "linkViaPopup":
      case "linkViaRedirect":
        return Tm;
      case "reauthViaPopup":
      case "reauthViaRedirect":
        return Em;
      default:
        Oe(
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
    }
  }
  resolve(e) {
    Xe(this.pendingPromise, "Pending promise was never set"), this.pendingPromise.resolve(e), this.unregisterAndCleanUp();
  }
  reject(e) {
    Xe(this.pendingPromise, "Pending promise was never set"), this.pendingPromise.reject(e), this.unregisterAndCleanUp();
  }
  unregisterAndCleanUp() {
    this.eventManager && this.eventManager.unregisterConsumer(this), this.pendingPromise = null, this.cleanUp();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Im = new ir(2e3, 1e4);
class Qt extends sl {
  constructor(e, t, r, s, o) {
    super(e, t, s, o), this.provider = r, this.authWindow = null, this.pollId = null, Qt.currentPopupAction && Qt.currentPopupAction.cancel(), Qt.currentPopupAction = this;
  }
  async executeNotNull() {
    const e = await this.execute();
    return M(
      e,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    ), e;
  }
  async onExecution() {
    Xe(this.filter.length === 1, "Popup operations only handle one event");
    const e = to();
    this.authWindow = await this.resolver._openPopup(
      this.auth,
      this.provider,
      this.filter[0],
      // There's always one, see constructor
      e
    ), this.authWindow.associatedEvent = e, this.resolver._originValidation(this.auth).catch((t) => {
      this.reject(t);
    }), this.resolver._isIframeWebStorageSupported(this.auth, (t) => {
      t || this.reject(Me(
        this.auth,
        "web-storage-unsupported"
        /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */
      ));
    }), this.pollUserCancellation();
  }
  get eventId() {
    var e;
    return ((e = this.authWindow) === null || e === void 0 ? void 0 : e.associatedEvent) || null;
  }
  cancel() {
    this.reject(Me(
      this.auth,
      "cancelled-popup-request"
      /* AuthErrorCode.EXPIRED_POPUP_REQUEST */
    ));
  }
  cleanUp() {
    this.authWindow && this.authWindow.close(), this.pollId && window.clearTimeout(this.pollId), this.authWindow = null, this.pollId = null, Qt.currentPopupAction = null;
  }
  pollUserCancellation() {
    const e = () => {
      var t, r;
      if (!((r = (t = this.authWindow) === null || t === void 0 ? void 0 : t.window) === null || r === void 0) && r.closed) {
        this.pollId = window.setTimeout(
          () => {
            this.pollId = null, this.reject(Me(
              this.auth,
              "popup-closed-by-user"
              /* AuthErrorCode.POPUP_CLOSED_BY_USER */
            ));
          },
          8e3
          /* _Timeout.AUTH_EVENT */
        );
        return;
      }
      this.pollId = window.setTimeout(e, Im.get());
    };
    e();
  }
}
Qt.currentPopupAction = null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const wm = "pendingRedirect", qr = /* @__PURE__ */ new Map();
class Am extends sl {
  constructor(e, t, r = !1) {
    super(e, [
      "signInViaRedirect",
      "linkViaRedirect",
      "reauthViaRedirect",
      "unknown"
      /* AuthEventType.UNKNOWN */
    ], t, void 0, r), this.eventId = null;
  }
  /**
   * Override the execute function; if we already have a redirect result, then
   * just return it.
   */
  async execute() {
    let e = qr.get(this.auth._key());
    if (!e) {
      try {
        const r = await Rm(this.resolver, this.auth) ? await super.execute() : null;
        e = () => Promise.resolve(r);
      } catch (t) {
        e = () => Promise.reject(t);
      }
      qr.set(this.auth._key(), e);
    }
    return this.bypassAuthState || qr.set(this.auth._key(), () => Promise.resolve(null)), e();
  }
  async onAuthEvent(e) {
    if (e.type === "signInViaRedirect")
      return super.onAuthEvent(e);
    if (e.type === "unknown") {
      this.resolve(null);
      return;
    }
    if (e.eventId) {
      const t = await this.auth._redirectUserForId(e.eventId);
      if (t)
        return this.user = t, super.onAuthEvent(e);
      this.resolve(null);
    }
  }
  async onExecution() {
  }
  cleanUp() {
  }
}
async function Rm(n, e) {
  const t = Cm(e), r = Pm(n);
  if (!await r._isAvailable())
    return !1;
  const s = await r._get(t) === "true";
  return await r._remove(t), s;
}
function Sm(n, e) {
  qr.set(n._key(), e);
}
function Pm(n) {
  return Ke(n._redirectPersistence);
}
function Cm(n) {
  return jr(wm, n.config.apiKey, n.name);
}
async function bm(n, e, t = !1) {
  if (ke(n.app))
    return Promise.reject(pt(n));
  const r = or(n), s = ym(r, e), a = await new Am(r, s, t).execute();
  return a && !t && (delete a.user._redirectEventId, await r._persistUserIfCurrent(a.user), await r._setRedirectUser(null, e)), a;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const km = 10 * 60 * 1e3;
class Vm {
  constructor(e) {
    this.auth = e, this.cachedEventUids = /* @__PURE__ */ new Set(), this.consumers = /* @__PURE__ */ new Set(), this.queuedRedirectEvent = null, this.hasHandledPotentialRedirect = !1, this.lastProcessedEventTime = Date.now();
  }
  registerConsumer(e) {
    this.consumers.add(e), this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, e) && (this.sendToConsumer(this.queuedRedirectEvent, e), this.saveEventToCache(this.queuedRedirectEvent), this.queuedRedirectEvent = null);
  }
  unregisterConsumer(e) {
    this.consumers.delete(e);
  }
  onEvent(e) {
    if (this.hasEventBeenHandled(e))
      return !1;
    let t = !1;
    return this.consumers.forEach((r) => {
      this.isEventForConsumer(e, r) && (t = !0, this.sendToConsumer(e, r), this.saveEventToCache(e));
    }), this.hasHandledPotentialRedirect || !Dm(e) || (this.hasHandledPotentialRedirect = !0, t || (this.queuedRedirectEvent = e, t = !0)), t;
  }
  sendToConsumer(e, t) {
    var r;
    if (e.error && !il(e)) {
      const s = ((r = e.error.code) === null || r === void 0 ? void 0 : r.split("auth/")[1]) || "internal-error";
      t.onError(Me(this.auth, s));
    } else
      t.onAuthEvent(e);
  }
  isEventForConsumer(e, t) {
    const r = t.eventId === null || !!e.eventId && e.eventId === t.eventId;
    return t.filter.includes(e.type) && r;
  }
  hasEventBeenHandled(e) {
    return Date.now() - this.lastProcessedEventTime >= km && this.cachedEventUids.clear(), this.cachedEventUids.has(hc(e));
  }
  saveEventToCache(e) {
    this.cachedEventUids.add(hc(e)), this.lastProcessedEventTime = Date.now();
  }
}
function hc(n) {
  return [n.type, n.eventId, n.sessionId, n.tenantId].filter((e) => e).join("-");
}
function il({ type: n, error: e }) {
  return n === "unknown" && (e == null ? void 0 : e.code) === "auth/no-auth-event";
}
function Dm(n) {
  switch (n.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
      return !0;
    case "unknown":
      return il(n);
    default:
      return !1;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Nm(n, e = {}) {
  return wt(n, "GET", "/v1/projects", e);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Om = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, Lm = /^https?/;
async function Mm(n) {
  if (n.config.emulator)
    return;
  const { authorizedDomains: e } = await Nm(n);
  for (const t of e)
    try {
      if (xm(t))
        return;
    } catch {
    }
  Oe(
    n,
    "unauthorized-domain"
    /* AuthErrorCode.INVALID_ORIGIN */
  );
}
function xm(n) {
  const e = Yr(), { protocol: t, hostname: r } = new URL(e);
  if (n.startsWith("chrome-extension://")) {
    const a = new URL(n);
    return a.hostname === "" && r === "" ? t === "chrome-extension:" && n.replace("chrome-extension://", "") === e.replace("chrome-extension://", "") : t === "chrome-extension:" && a.hostname === r;
  }
  if (!Lm.test(t))
    return !1;
  if (Om.test(n))
    return r === n;
  const s = n.replace(/\./g, "\\.");
  return new RegExp("^(.+\\." + s + "|" + s + ")$", "i").test(r);
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Um = new ir(3e4, 6e4);
function dc() {
  const n = xe().___jsl;
  if (n != null && n.H) {
    for (const e of Object.keys(n.H))
      if (n.H[e].r = n.H[e].r || [], n.H[e].L = n.H[e].L || [], n.H[e].r = [...n.H[e].L], n.CP)
        for (let t = 0; t < n.CP.length; t++)
          n.CP[t] = null;
  }
}
function Fm(n) {
  return new Promise((e, t) => {
    var r, s, o;
    function a() {
      dc(), gapi.load("gapi.iframes", {
        callback: () => {
          e(gapi.iframes.getContext());
        },
        ontimeout: () => {
          dc(), t(Me(
            n,
            "network-request-failed"
            /* AuthErrorCode.NETWORK_REQUEST_FAILED */
          ));
        },
        timeout: Um.get()
      });
    }
    if (!((s = (r = xe().gapi) === null || r === void 0 ? void 0 : r.iframes) === null || s === void 0) && s.Iframe)
      e(gapi.iframes.getContext());
    else if (!((o = xe().gapi) === null || o === void 0) && o.load)
      a();
    else {
      const u = Np("iframefcb");
      return xe()[u] = () => {
        gapi.load ? a() : t(Me(
          n,
          "network-request-failed"
          /* AuthErrorCode.NETWORK_REQUEST_FAILED */
        ));
      }, $u(`${Dp()}?onload=${u}`).catch((l) => t(l));
    }
  }).catch((e) => {
    throw $r = null, e;
  });
}
let $r = null;
function Bm(n) {
  return $r = $r || Fm(n), $r;
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const jm = new ir(5e3, 15e3), qm = "__/auth/iframe", $m = "emulator/auth/iframe", zm = {
  style: {
    position: "absolute",
    top: "-100px",
    width: "1px",
    height: "1px"
  },
  "aria-hidden": "true",
  tabindex: "-1"
}, Hm = /* @__PURE__ */ new Map([
  ["identitytoolkit.googleapis.com", "p"],
  // production
  ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
  // staging
  ["test-identitytoolkit.sandbox.googleapis.com", "t"]
  // test
]);
function Wm(n) {
  const e = n.config;
  M(
    e.authDomain,
    n,
    "auth-domain-config-required"
    /* AuthErrorCode.MISSING_AUTH_DOMAIN */
  );
  const t = e.emulator ? Xi(e, $m) : `https://${n.config.authDomain}/${qm}`, r = {
    apiKey: e.apiKey,
    appName: n.name,
    v: dn
  }, s = Hm.get(n.config.apiHost);
  s && (r.eid = s);
  const o = n._getFrameworks();
  return o.length && (r.fw = o.join(",")), `${t}?${sr(r).slice(1)}`;
}
async function Km(n) {
  const e = await Bm(n), t = xe().gapi;
  return M(
    t,
    n,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  ), e.open({
    where: document.body,
    url: Wm(n),
    messageHandlersFilter: t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
    attributes: zm,
    dontclear: !0
  }, (r) => new Promise(async (s, o) => {
    await r.restyle({
      // Prevent iframe from closing on mouse out.
      setHideOnLeave: !1
    });
    const a = Me(
      n,
      "network-request-failed"
      /* AuthErrorCode.NETWORK_REQUEST_FAILED */
    ), u = xe().setTimeout(() => {
      o(a);
    }, jm.get());
    function l() {
      xe().clearTimeout(u), s(r);
    }
    r.ping(l).then(l, () => {
      o(a);
    });
  }));
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Gm = {
  location: "yes",
  resizable: "yes",
  statusbar: "yes",
  toolbar: "no"
}, Qm = 500, Jm = 600, Xm = "_blank", Ym = "http://localhost";
class fc {
  constructor(e) {
    this.window = e, this.associatedEvent = null;
  }
  close() {
    if (this.window)
      try {
        this.window.close();
      } catch {
      }
  }
}
function Zm(n, e, t, r = Qm, s = Jm) {
  const o = Math.max((window.screen.availHeight - s) / 2, 0).toString(), a = Math.max((window.screen.availWidth - r) / 2, 0).toString();
  let u = "";
  const l = Object.assign(Object.assign({}, Gm), {
    width: r.toString(),
    height: s.toString(),
    top: o,
    left: a
  }), d = Ee().toLowerCase();
  t && (u = Mu(d) ? Xm : t), Ou(d) && (e = e || Ym, l.scrollbars = "yes");
  const p = Object.entries(l).reduce((w, [P, k]) => `${w}${P}=${k},`, "");
  if (wp(d) && u !== "_self")
    return eg(e || "", u), new fc(null);
  const y = window.open(e || "", u, p);
  M(
    y,
    n,
    "popup-blocked"
    /* AuthErrorCode.POPUP_BLOCKED */
  );
  try {
    y.focus();
  } catch {
  }
  return new fc(y);
}
function eg(n, e) {
  const t = document.createElement("a");
  t.href = n, t.target = e;
  const r = document.createEvent("MouseEvent");
  r.initMouseEvent("click", !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 1, null), t.dispatchEvent(r);
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tg = "__/auth/handler", ng = "emulator/auth/handler", rg = encodeURIComponent("fac");
async function pc(n, e, t, r, s, o) {
  M(
    n.config.authDomain,
    n,
    "auth-domain-config-required"
    /* AuthErrorCode.MISSING_AUTH_DOMAIN */
  ), M(
    n.config.apiKey,
    n,
    "invalid-api-key"
    /* AuthErrorCode.INVALID_API_KEY */
  );
  const a = {
    apiKey: n.config.apiKey,
    appName: n.name,
    authType: t,
    redirectUrl: r,
    v: dn,
    eventId: s
  };
  if (e instanceof Ku) {
    e.setDefaultLanguage(n.languageCode), a.providerId = e.providerId || "", $d(e.getCustomParameters()) || (a.customParameters = JSON.stringify(e.getCustomParameters()));
    for (const [p, y] of Object.entries({}))
      a[p] = y;
  }
  if (e instanceof ar) {
    const p = e.getScopes().filter((y) => y !== "");
    p.length > 0 && (a.scopes = p.join(","));
  }
  n.tenantId && (a.tid = n.tenantId);
  const u = a;
  for (const p of Object.keys(u))
    u[p] === void 0 && delete u[p];
  const l = await n._getAppCheckToken(), d = l ? `#${rg}=${encodeURIComponent(l)}` : "";
  return `${sg(n)}?${sr(u).slice(1)}${d}`;
}
function sg({ config: n }) {
  return n.emulator ? Xi(n, ng) : `https://${n.authDomain}/${tg}`;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const gi = "webStorageSupport";
class ig {
  constructor() {
    this.eventManagers = {}, this.iframes = {}, this.originValidationPromises = {}, this._redirectPersistence = Zu, this._completeRedirectFn = bm, this._overrideRedirectResult = Sm;
  }
  // Wrapping in async even though we don't await anywhere in order
  // to make sure errors are raised as promise rejections
  async _openPopup(e, t, r, s) {
    var o;
    Xe((o = this.eventManagers[e._key()]) === null || o === void 0 ? void 0 : o.manager, "_initialize() not called before _openPopup()");
    const a = await pc(e, t, r, Yr(), s);
    return Zm(e, a, to());
  }
  async _openRedirect(e, t, r, s) {
    await this._originValidation(e);
    const o = await pc(e, t, r, Yr(), s);
    return cm(o), new Promise(() => {
    });
  }
  _initialize(e) {
    const t = e._key();
    if (this.eventManagers[t]) {
      const { manager: s, promise: o } = this.eventManagers[t];
      return s ? Promise.resolve(s) : (Xe(o, "If manager is not set, promise should be"), o);
    }
    const r = this.initAndGetManager(e);
    return this.eventManagers[t] = { promise: r }, r.catch(() => {
      delete this.eventManagers[t];
    }), r;
  }
  async initAndGetManager(e) {
    const t = await Km(e), r = new Vm(e);
    return t.register("authEvent", (s) => (M(
      s == null ? void 0 : s.authEvent,
      e,
      "invalid-auth-event"
      /* AuthErrorCode.INVALID_AUTH_EVENT */
    ), {
      status: r.onEvent(s.authEvent) ? "ACK" : "ERROR"
      /* GapiOutcome.ERROR */
    }), gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER), this.eventManagers[e._key()] = { manager: r }, this.iframes[e._key()] = t, r;
  }
  _isIframeWebStorageSupported(e, t) {
    this.iframes[e._key()].send(gi, { type: gi }, (s) => {
      var o;
      const a = (o = s == null ? void 0 : s[0]) === null || o === void 0 ? void 0 : o[gi];
      a !== void 0 && t(!!a), Oe(
        e,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
    }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
  }
  _originValidation(e) {
    const t = e._key();
    return this.originValidationPromises[t] || (this.originValidationPromises[t] = Mm(e)), this.originValidationPromises[t];
  }
  get _shouldInitProactively() {
    return ju() || Lu() || Zi();
  }
}
const og = ig;
var mc = "@firebase/auth", gc = "1.10.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ag {
  constructor(e) {
    this.auth = e, this.internalListeners = /* @__PURE__ */ new Map();
  }
  getUid() {
    var e;
    return this.assertAuthConfigured(), ((e = this.auth.currentUser) === null || e === void 0 ? void 0 : e.uid) || null;
  }
  async getToken(e) {
    return this.assertAuthConfigured(), await this.auth._initializationPromise, this.auth.currentUser ? { accessToken: await this.auth.currentUser.getIdToken(e) } : null;
  }
  addAuthTokenListener(e) {
    if (this.assertAuthConfigured(), this.internalListeners.has(e))
      return;
    const t = this.auth.onIdTokenChanged((r) => {
      e((r == null ? void 0 : r.stsTokenManager.accessToken) || null);
    });
    this.internalListeners.set(e, t), this.updateProactiveRefresh();
  }
  removeAuthTokenListener(e) {
    this.assertAuthConfigured();
    const t = this.internalListeners.get(e);
    t && (this.internalListeners.delete(e), t(), this.updateProactiveRefresh());
  }
  assertAuthConfigured() {
    M(
      this.auth._initializationPromise,
      "dependent-sdk-initialized-before-auth"
      /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
    );
  }
  updateProactiveRefresh() {
    this.internalListeners.size > 0 ? this.auth._startProactiveRefresh() : this.auth._stopProactiveRefresh();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function cg(n) {
  switch (n) {
    case "Node":
      return "node";
    case "ReactNative":
      return "rn";
    case "Worker":
      return "webworker";
    case "Cordova":
      return "cordova";
    case "WebExtension":
      return "web-extension";
    default:
      return;
  }
}
function ug(n) {
  en(new Ot(
    "auth",
    (e, { options: t }) => {
      const r = e.getProvider("app").getImmediate(), s = e.getProvider("heartbeat"), o = e.getProvider("app-check-internal"), { apiKey: a, authDomain: u } = r.options;
      M(a && !a.includes(":"), "invalid-api-key", { appName: r.name });
      const l = {
        apiKey: a,
        authDomain: u,
        clientPlatform: n,
        apiHost: "identitytoolkit.googleapis.com",
        tokenApiHost: "securetoken.googleapis.com",
        apiScheme: "https",
        sdkClientVersion: qu(n)
      }, d = new bp(r, s, o, l);
      return Fp(d, t), d;
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  ).setInstanceCreatedCallback((e, t, r) => {
    e.getProvider(
      "auth-internal"
      /* _ComponentName.AUTH_INTERNAL */
    ).initialize();
  })), en(new Ot(
    "auth-internal",
    (e) => {
      const t = or(e.getProvider(
        "auth"
        /* _ComponentName.AUTH */
      ).getImmediate());
      return ((r) => new ag(r))(t);
    },
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  )), ft(mc, gc, cg(n)), ft(mc, gc, "esm2017");
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const lg = 5 * 60, hg = Eu("authIdTokenMaxAge") || lg;
let _c = null;
const dg = (n) => async (e) => {
  const t = e && await e.getIdTokenResult(), r = t && ((/* @__PURE__ */ new Date()).getTime() - Date.parse(t.issuedAtTime)) / 1e3;
  if (r && r > hg)
    return;
  const s = t == null ? void 0 : t.token;
  _c !== s && (_c = s, await fetch(n, {
    method: s ? "POST" : "DELETE",
    headers: s ? {
      Authorization: `Bearer ${s}`
    } : {}
  }));
};
function fg(n = Gi()) {
  const e = Ki(n, "auth");
  if (e.isInitialized())
    return e.getImmediate();
  const t = Up(n, {
    popupRedirectResolver: og,
    persistence: [
      _m,
      im,
      Zu
    ]
  }), r = Eu("authTokenSyncURL");
  if (r && typeof isSecureContext == "boolean" && isSecureContext) {
    const o = new URL(r, location.origin);
    if (location.origin === o.origin) {
      const a = dg(o.toString());
      tm(t, a, () => a(t.currentUser)), em(t, (u) => a(u));
    }
  }
  const s = yu("auth");
  return s && Hu(t, `http://${s}`), t;
}
function pg() {
  var n, e;
  return (e = (n = document.getElementsByTagName("head")) === null || n === void 0 ? void 0 : n[0]) !== null && e !== void 0 ? e : document;
}
kp({
  loadJS(n) {
    return new Promise((e, t) => {
      const r = document.createElement("script");
      r.setAttribute("src", n), r.onload = e, r.onerror = (s) => {
        const o = Me(
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        o.customData = s, t(o);
      }, r.type = "text/javascript", r.charset = "UTF-8", pg().appendChild(r);
    });
  },
  gapiScript: "https://apis.google.com/js/api.js",
  recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
  recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
});
ug(
  "Browser"
  /* ClientPlatform.BROWSER */
);
var yc = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/
var mt, ol;
(function() {
  var n;
  /** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
  function e(E, m) {
    function _() {
    }
    _.prototype = m.prototype, E.D = m.prototype, E.prototype = new _(), E.prototype.constructor = E, E.C = function(v, T, A) {
      for (var g = Array(arguments.length - 2), $e = 2; $e < arguments.length; $e++) g[$e - 2] = arguments[$e];
      return m.prototype[T].apply(v, g);
    };
  }
  function t() {
    this.blockSize = -1;
  }
  function r() {
    this.blockSize = -1, this.blockSize = 64, this.g = Array(4), this.B = Array(this.blockSize), this.o = this.h = 0, this.s();
  }
  e(r, t), r.prototype.s = function() {
    this.g[0] = 1732584193, this.g[1] = 4023233417, this.g[2] = 2562383102, this.g[3] = 271733878, this.o = this.h = 0;
  };
  function s(E, m, _) {
    _ || (_ = 0);
    var v = Array(16);
    if (typeof m == "string") for (var T = 0; 16 > T; ++T) v[T] = m.charCodeAt(_++) | m.charCodeAt(_++) << 8 | m.charCodeAt(_++) << 16 | m.charCodeAt(_++) << 24;
    else for (T = 0; 16 > T; ++T) v[T] = m[_++] | m[_++] << 8 | m[_++] << 16 | m[_++] << 24;
    m = E.g[0], _ = E.g[1], T = E.g[2];
    var A = E.g[3], g = m + (A ^ _ & (T ^ A)) + v[0] + 3614090360 & 4294967295;
    m = _ + (g << 7 & 4294967295 | g >>> 25), g = A + (T ^ m & (_ ^ T)) + v[1] + 3905402710 & 4294967295, A = m + (g << 12 & 4294967295 | g >>> 20), g = T + (_ ^ A & (m ^ _)) + v[2] + 606105819 & 4294967295, T = A + (g << 17 & 4294967295 | g >>> 15), g = _ + (m ^ T & (A ^ m)) + v[3] + 3250441966 & 4294967295, _ = T + (g << 22 & 4294967295 | g >>> 10), g = m + (A ^ _ & (T ^ A)) + v[4] + 4118548399 & 4294967295, m = _ + (g << 7 & 4294967295 | g >>> 25), g = A + (T ^ m & (_ ^ T)) + v[5] + 1200080426 & 4294967295, A = m + (g << 12 & 4294967295 | g >>> 20), g = T + (_ ^ A & (m ^ _)) + v[6] + 2821735955 & 4294967295, T = A + (g << 17 & 4294967295 | g >>> 15), g = _ + (m ^ T & (A ^ m)) + v[7] + 4249261313 & 4294967295, _ = T + (g << 22 & 4294967295 | g >>> 10), g = m + (A ^ _ & (T ^ A)) + v[8] + 1770035416 & 4294967295, m = _ + (g << 7 & 4294967295 | g >>> 25), g = A + (T ^ m & (_ ^ T)) + v[9] + 2336552879 & 4294967295, A = m + (g << 12 & 4294967295 | g >>> 20), g = T + (_ ^ A & (m ^ _)) + v[10] + 4294925233 & 4294967295, T = A + (g << 17 & 4294967295 | g >>> 15), g = _ + (m ^ T & (A ^ m)) + v[11] + 2304563134 & 4294967295, _ = T + (g << 22 & 4294967295 | g >>> 10), g = m + (A ^ _ & (T ^ A)) + v[12] + 1804603682 & 4294967295, m = _ + (g << 7 & 4294967295 | g >>> 25), g = A + (T ^ m & (_ ^ T)) + v[13] + 4254626195 & 4294967295, A = m + (g << 12 & 4294967295 | g >>> 20), g = T + (_ ^ A & (m ^ _)) + v[14] + 2792965006 & 4294967295, T = A + (g << 17 & 4294967295 | g >>> 15), g = _ + (m ^ T & (A ^ m)) + v[15] + 1236535329 & 4294967295, _ = T + (g << 22 & 4294967295 | g >>> 10), g = m + (T ^ A & (_ ^ T)) + v[1] + 4129170786 & 4294967295, m = _ + (g << 5 & 4294967295 | g >>> 27), g = A + (_ ^ T & (m ^ _)) + v[6] + 3225465664 & 4294967295, A = m + (g << 9 & 4294967295 | g >>> 23), g = T + (m ^ _ & (A ^ m)) + v[11] + 643717713 & 4294967295, T = A + (g << 14 & 4294967295 | g >>> 18), g = _ + (A ^ m & (T ^ A)) + v[0] + 3921069994 & 4294967295, _ = T + (g << 20 & 4294967295 | g >>> 12), g = m + (T ^ A & (_ ^ T)) + v[5] + 3593408605 & 4294967295, m = _ + (g << 5 & 4294967295 | g >>> 27), g = A + (_ ^ T & (m ^ _)) + v[10] + 38016083 & 4294967295, A = m + (g << 9 & 4294967295 | g >>> 23), g = T + (m ^ _ & (A ^ m)) + v[15] + 3634488961 & 4294967295, T = A + (g << 14 & 4294967295 | g >>> 18), g = _ + (A ^ m & (T ^ A)) + v[4] + 3889429448 & 4294967295, _ = T + (g << 20 & 4294967295 | g >>> 12), g = m + (T ^ A & (_ ^ T)) + v[9] + 568446438 & 4294967295, m = _ + (g << 5 & 4294967295 | g >>> 27), g = A + (_ ^ T & (m ^ _)) + v[14] + 3275163606 & 4294967295, A = m + (g << 9 & 4294967295 | g >>> 23), g = T + (m ^ _ & (A ^ m)) + v[3] + 4107603335 & 4294967295, T = A + (g << 14 & 4294967295 | g >>> 18), g = _ + (A ^ m & (T ^ A)) + v[8] + 1163531501 & 4294967295, _ = T + (g << 20 & 4294967295 | g >>> 12), g = m + (T ^ A & (_ ^ T)) + v[13] + 2850285829 & 4294967295, m = _ + (g << 5 & 4294967295 | g >>> 27), g = A + (_ ^ T & (m ^ _)) + v[2] + 4243563512 & 4294967295, A = m + (g << 9 & 4294967295 | g >>> 23), g = T + (m ^ _ & (A ^ m)) + v[7] + 1735328473 & 4294967295, T = A + (g << 14 & 4294967295 | g >>> 18), g = _ + (A ^ m & (T ^ A)) + v[12] + 2368359562 & 4294967295, _ = T + (g << 20 & 4294967295 | g >>> 12), g = m + (_ ^ T ^ A) + v[5] + 4294588738 & 4294967295, m = _ + (g << 4 & 4294967295 | g >>> 28), g = A + (m ^ _ ^ T) + v[8] + 2272392833 & 4294967295, A = m + (g << 11 & 4294967295 | g >>> 21), g = T + (A ^ m ^ _) + v[11] + 1839030562 & 4294967295, T = A + (g << 16 & 4294967295 | g >>> 16), g = _ + (T ^ A ^ m) + v[14] + 4259657740 & 4294967295, _ = T + (g << 23 & 4294967295 | g >>> 9), g = m + (_ ^ T ^ A) + v[1] + 2763975236 & 4294967295, m = _ + (g << 4 & 4294967295 | g >>> 28), g = A + (m ^ _ ^ T) + v[4] + 1272893353 & 4294967295, A = m + (g << 11 & 4294967295 | g >>> 21), g = T + (A ^ m ^ _) + v[7] + 4139469664 & 4294967295, T = A + (g << 16 & 4294967295 | g >>> 16), g = _ + (T ^ A ^ m) + v[10] + 3200236656 & 4294967295, _ = T + (g << 23 & 4294967295 | g >>> 9), g = m + (_ ^ T ^ A) + v[13] + 681279174 & 4294967295, m = _ + (g << 4 & 4294967295 | g >>> 28), g = A + (m ^ _ ^ T) + v[0] + 3936430074 & 4294967295, A = m + (g << 11 & 4294967295 | g >>> 21), g = T + (A ^ m ^ _) + v[3] + 3572445317 & 4294967295, T = A + (g << 16 & 4294967295 | g >>> 16), g = _ + (T ^ A ^ m) + v[6] + 76029189 & 4294967295, _ = T + (g << 23 & 4294967295 | g >>> 9), g = m + (_ ^ T ^ A) + v[9] + 3654602809 & 4294967295, m = _ + (g << 4 & 4294967295 | g >>> 28), g = A + (m ^ _ ^ T) + v[12] + 3873151461 & 4294967295, A = m + (g << 11 & 4294967295 | g >>> 21), g = T + (A ^ m ^ _) + v[15] + 530742520 & 4294967295, T = A + (g << 16 & 4294967295 | g >>> 16), g = _ + (T ^ A ^ m) + v[2] + 3299628645 & 4294967295, _ = T + (g << 23 & 4294967295 | g >>> 9), g = m + (T ^ (_ | ~A)) + v[0] + 4096336452 & 4294967295, m = _ + (g << 6 & 4294967295 | g >>> 26), g = A + (_ ^ (m | ~T)) + v[7] + 1126891415 & 4294967295, A = m + (g << 10 & 4294967295 | g >>> 22), g = T + (m ^ (A | ~_)) + v[14] + 2878612391 & 4294967295, T = A + (g << 15 & 4294967295 | g >>> 17), g = _ + (A ^ (T | ~m)) + v[5] + 4237533241 & 4294967295, _ = T + (g << 21 & 4294967295 | g >>> 11), g = m + (T ^ (_ | ~A)) + v[12] + 1700485571 & 4294967295, m = _ + (g << 6 & 4294967295 | g >>> 26), g = A + (_ ^ (m | ~T)) + v[3] + 2399980690 & 4294967295, A = m + (g << 10 & 4294967295 | g >>> 22), g = T + (m ^ (A | ~_)) + v[10] + 4293915773 & 4294967295, T = A + (g << 15 & 4294967295 | g >>> 17), g = _ + (A ^ (T | ~m)) + v[1] + 2240044497 & 4294967295, _ = T + (g << 21 & 4294967295 | g >>> 11), g = m + (T ^ (_ | ~A)) + v[8] + 1873313359 & 4294967295, m = _ + (g << 6 & 4294967295 | g >>> 26), g = A + (_ ^ (m | ~T)) + v[15] + 4264355552 & 4294967295, A = m + (g << 10 & 4294967295 | g >>> 22), g = T + (m ^ (A | ~_)) + v[6] + 2734768916 & 4294967295, T = A + (g << 15 & 4294967295 | g >>> 17), g = _ + (A ^ (T | ~m)) + v[13] + 1309151649 & 4294967295, _ = T + (g << 21 & 4294967295 | g >>> 11), g = m + (T ^ (_ | ~A)) + v[4] + 4149444226 & 4294967295, m = _ + (g << 6 & 4294967295 | g >>> 26), g = A + (_ ^ (m | ~T)) + v[11] + 3174756917 & 4294967295, A = m + (g << 10 & 4294967295 | g >>> 22), g = T + (m ^ (A | ~_)) + v[2] + 718787259 & 4294967295, T = A + (g << 15 & 4294967295 | g >>> 17), g = _ + (A ^ (T | ~m)) + v[9] + 3951481745 & 4294967295, E.g[0] = E.g[0] + m & 4294967295, E.g[1] = E.g[1] + (T + (g << 21 & 4294967295 | g >>> 11)) & 4294967295, E.g[2] = E.g[2] + T & 4294967295, E.g[3] = E.g[3] + A & 4294967295;
  }
  r.prototype.u = function(E, m) {
    m === void 0 && (m = E.length);
    for (var _ = m - this.blockSize, v = this.B, T = this.h, A = 0; A < m; ) {
      if (T == 0) for (; A <= _; ) s(this, E, A), A += this.blockSize;
      if (typeof E == "string") {
        for (; A < m; )
          if (v[T++] = E.charCodeAt(A++), T == this.blockSize) {
            s(this, v), T = 0;
            break;
          }
      } else for (; A < m; ) if (v[T++] = E[A++], T == this.blockSize) {
        s(this, v), T = 0;
        break;
      }
    }
    this.h = T, this.o += m;
  }, r.prototype.v = function() {
    var E = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
    E[0] = 128;
    for (var m = 1; m < E.length - 8; ++m) E[m] = 0;
    var _ = 8 * this.o;
    for (m = E.length - 8; m < E.length; ++m) E[m] = _ & 255, _ /= 256;
    for (this.u(E), E = Array(16), m = _ = 0; 4 > m; ++m) for (var v = 0; 32 > v; v += 8) E[_++] = this.g[m] >>> v & 255;
    return E;
  };
  function o(E, m) {
    var _ = u;
    return Object.prototype.hasOwnProperty.call(_, E) ? _[E] : _[E] = m(E);
  }
  function a(E, m) {
    this.h = m;
    for (var _ = [], v = !0, T = E.length - 1; 0 <= T; T--) {
      var A = E[T] | 0;
      v && A == m || (_[T] = A, v = !1);
    }
    this.g = _;
  }
  var u = {};
  function l(E) {
    return -128 <= E && 128 > E ? o(E, function(m) {
      return new a([m | 0], 0 > m ? -1 : 0);
    }) : new a([E | 0], 0 > E ? -1 : 0);
  }
  function d(E) {
    if (isNaN(E) || !isFinite(E)) return y;
    if (0 > E) return V(d(-E));
    for (var m = [], _ = 1, v = 0; E >= _; v++) m[v] = E / _ | 0, _ *= 4294967296;
    return new a(m, 0);
  }
  function p(E, m) {
    if (E.length == 0) throw Error("number format error: empty string");
    if (m = m || 10, 2 > m || 36 < m) throw Error("radix out of range: " + m);
    if (E.charAt(0) == "-") return V(p(E.substring(1), m));
    if (0 <= E.indexOf("-")) throw Error('number format error: interior "-" character');
    for (var _ = d(Math.pow(m, 8)), v = y, T = 0; T < E.length; T += 8) {
      var A = Math.min(8, E.length - T), g = parseInt(E.substring(T, T + A), m);
      8 > A ? (A = d(Math.pow(m, A)), v = v.j(A).add(d(g))) : (v = v.j(_), v = v.add(d(g)));
    }
    return v;
  }
  var y = l(0), w = l(1), P = l(16777216);
  n = a.prototype, n.m = function() {
    if (N(this)) return -V(this).m();
    for (var E = 0, m = 1, _ = 0; _ < this.g.length; _++) {
      var v = this.i(_);
      E += (0 <= v ? v : 4294967296 + v) * m, m *= 4294967296;
    }
    return E;
  }, n.toString = function(E) {
    if (E = E || 10, 2 > E || 36 < E) throw Error("radix out of range: " + E);
    if (k(this)) return "0";
    if (N(this)) return "-" + V(this).toString(E);
    for (var m = d(Math.pow(E, 6)), _ = this, v = ""; ; ) {
      var T = ee(_, m).g;
      _ = K(_, T.j(m));
      var A = ((0 < _.g.length ? _.g[0] : _.h) >>> 0).toString(E);
      if (_ = T, k(_)) return A + v;
      for (; 6 > A.length; ) A = "0" + A;
      v = A + v;
    }
  }, n.i = function(E) {
    return 0 > E ? 0 : E < this.g.length ? this.g[E] : this.h;
  };
  function k(E) {
    if (E.h != 0) return !1;
    for (var m = 0; m < E.g.length; m++) if (E.g[m] != 0) return !1;
    return !0;
  }
  function N(E) {
    return E.h == -1;
  }
  n.l = function(E) {
    return E = K(this, E), N(E) ? -1 : k(E) ? 0 : 1;
  };
  function V(E) {
    for (var m = E.g.length, _ = [], v = 0; v < m; v++) _[v] = ~E.g[v];
    return new a(_, ~E.h).add(w);
  }
  n.abs = function() {
    return N(this) ? V(this) : this;
  }, n.add = function(E) {
    for (var m = Math.max(this.g.length, E.g.length), _ = [], v = 0, T = 0; T <= m; T++) {
      var A = v + (this.i(T) & 65535) + (E.i(T) & 65535), g = (A >>> 16) + (this.i(T) >>> 16) + (E.i(T) >>> 16);
      v = g >>> 16, A &= 65535, g &= 65535, _[T] = g << 16 | A;
    }
    return new a(_, _[_.length - 1] & -2147483648 ? -1 : 0);
  };
  function K(E, m) {
    return E.add(V(m));
  }
  n.j = function(E) {
    if (k(this) || k(E)) return y;
    if (N(this)) return N(E) ? V(this).j(V(E)) : V(V(this).j(E));
    if (N(E)) return V(this.j(V(E)));
    if (0 > this.l(P) && 0 > E.l(P)) return d(this.m() * E.m());
    for (var m = this.g.length + E.g.length, _ = [], v = 0; v < 2 * m; v++) _[v] = 0;
    for (v = 0; v < this.g.length; v++) for (var T = 0; T < E.g.length; T++) {
      var A = this.i(v) >>> 16, g = this.i(v) & 65535, $e = E.i(T) >>> 16, vn = E.i(T) & 65535;
      _[2 * v + 2 * T] += g * vn, z(_, 2 * v + 2 * T), _[2 * v + 2 * T + 1] += A * vn, z(_, 2 * v + 2 * T + 1), _[2 * v + 2 * T + 1] += g * $e, z(_, 2 * v + 2 * T + 1), _[2 * v + 2 * T + 2] += A * $e, z(_, 2 * v + 2 * T + 2);
    }
    for (v = 0; v < m; v++) _[v] = _[2 * v + 1] << 16 | _[2 * v];
    for (v = m; v < 2 * m; v++) _[v] = 0;
    return new a(_, 0);
  };
  function z(E, m) {
    for (; (E[m] & 65535) != E[m]; ) E[m + 1] += E[m] >>> 16, E[m] &= 65535, m++;
  }
  function H(E, m) {
    this.g = E, this.h = m;
  }
  function ee(E, m) {
    if (k(m)) throw Error("division by zero");
    if (k(E)) return new H(y, y);
    if (N(E)) return m = ee(V(E), m), new H(V(m.g), V(m.h));
    if (N(m)) return m = ee(E, V(m)), new H(V(m.g), m.h);
    if (30 < E.g.length) {
      if (N(E) || N(m)) throw Error("slowDivide_ only works with positive integers.");
      for (var _ = w, v = m; 0 >= v.l(E); ) _ = Ce(_), v = Ce(v);
      var T = te(_, 1), A = te(v, 1);
      for (v = te(v, 2), _ = te(_, 2); !k(v); ) {
        var g = A.add(v);
        0 >= g.l(E) && (T = T.add(_), A = g), v = te(v, 1), _ = te(_, 1);
      }
      return m = K(E, T.j(m)), new H(T, m);
    }
    for (T = y; 0 <= E.l(m); ) {
      for (_ = Math.max(1, Math.floor(E.m() / m.m())), v = Math.ceil(Math.log(_) / Math.LN2), v = 48 >= v ? 1 : Math.pow(2, v - 48), A = d(_), g = A.j(m); N(g) || 0 < g.l(E); ) _ -= v, A = d(_), g = A.j(m);
      k(A) && (A = w), T = T.add(A), E = K(E, g);
    }
    return new H(T, E);
  }
  n.A = function(E) {
    return ee(this, E).h;
  }, n.and = function(E) {
    for (var m = Math.max(this.g.length, E.g.length), _ = [], v = 0; v < m; v++) _[v] = this.i(v) & E.i(v);
    return new a(_, this.h & E.h);
  }, n.or = function(E) {
    for (var m = Math.max(this.g.length, E.g.length), _ = [], v = 0; v < m; v++) _[v] = this.i(v) | E.i(v);
    return new a(_, this.h | E.h);
  }, n.xor = function(E) {
    for (var m = Math.max(this.g.length, E.g.length), _ = [], v = 0; v < m; v++) _[v] = this.i(v) ^ E.i(v);
    return new a(_, this.h ^ E.h);
  };
  function Ce(E) {
    for (var m = E.g.length + 1, _ = [], v = 0; v < m; v++) _[v] = E.i(v) << 1 | E.i(v - 1) >>> 31;
    return new a(_, E.h);
  }
  function te(E, m) {
    var _ = m >> 5;
    m %= 32;
    for (var v = E.g.length - _, T = [], A = 0; A < v; A++) T[A] = 0 < m ? E.i(A + _) >>> m | E.i(A + _ + 1) << 32 - m : E.i(A + _);
    return new a(T, E.h);
  }
  r.prototype.digest = r.prototype.v, r.prototype.reset = r.prototype.s, r.prototype.update = r.prototype.u, ol = r, a.prototype.add = a.prototype.add, a.prototype.multiply = a.prototype.j, a.prototype.modulo = a.prototype.A, a.prototype.compare = a.prototype.l, a.prototype.toNumber = a.prototype.m, a.prototype.toString = a.prototype.toString, a.prototype.getBits = a.prototype.i, a.fromNumber = d, a.fromString = p, mt = a;
}).apply(typeof yc < "u" ? yc : typeof self < "u" ? self : typeof window < "u" ? window : {});
var Nr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/
var al, Un, cl, zr, Ci, ul, ll, hl;
(function() {
  var n, e = typeof Object.defineProperties == "function" ? Object.defineProperty : function(i, c, h) {
    return i == Array.prototype || i == Object.prototype || (i[c] = h.value), i;
  };
  function t(i) {
    i = [typeof globalThis == "object" && globalThis, i, typeof window == "object" && window, typeof self == "object" && self, typeof Nr == "object" && Nr];
    for (var c = 0; c < i.length; ++c) {
      var h = i[c];
      if (h && h.Math == Math) return h;
    }
    throw Error("Cannot find global object");
  }
  var r = t(this);
  function s(i, c) {
    if (c) e: {
      var h = r;
      i = i.split(".");
      for (var f = 0; f < i.length - 1; f++) {
        var I = i[f];
        if (!(I in h)) break e;
        h = h[I];
      }
      i = i[i.length - 1], f = h[i], c = c(f), c != f && c != null && e(h, i, { configurable: !0, writable: !0, value: c });
    }
  }
  function o(i, c) {
    i instanceof String && (i += "");
    var h = 0, f = !1, I = { next: function() {
      if (!f && h < i.length) {
        var R = h++;
        return { value: c(R, i[R]), done: !1 };
      }
      return f = !0, { done: !0, value: void 0 };
    } };
    return I[Symbol.iterator] = function() {
      return I;
    }, I;
  }
  s("Array.prototype.values", function(i) {
    return i || function() {
      return o(this, function(c, h) {
        return h;
      });
    };
  });
  /** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
  var a = a || {}, u = this || self;
  function l(i) {
    var c = typeof i;
    return c = c != "object" ? c : i ? Array.isArray(i) ? "array" : c : "null", c == "array" || c == "object" && typeof i.length == "number";
  }
  function d(i) {
    var c = typeof i;
    return c == "object" && i != null || c == "function";
  }
  function p(i, c, h) {
    return i.call.apply(i.bind, arguments);
  }
  function y(i, c, h) {
    if (!i) throw Error();
    if (2 < arguments.length) {
      var f = Array.prototype.slice.call(arguments, 2);
      return function() {
        var I = Array.prototype.slice.call(arguments);
        return Array.prototype.unshift.apply(I, f), i.apply(c, I);
      };
    }
    return function() {
      return i.apply(c, arguments);
    };
  }
  function w(i, c, h) {
    return w = Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? p : y, w.apply(null, arguments);
  }
  function P(i, c) {
    var h = Array.prototype.slice.call(arguments, 1);
    return function() {
      var f = h.slice();
      return f.push.apply(f, arguments), i.apply(this, f);
    };
  }
  function k(i, c) {
    function h() {
    }
    h.prototype = c.prototype, i.aa = c.prototype, i.prototype = new h(), i.prototype.constructor = i, i.Qb = function(f, I, R) {
      for (var b = Array(arguments.length - 2), Q = 2; Q < arguments.length; Q++) b[Q - 2] = arguments[Q];
      return c.prototype[I].apply(f, b);
    };
  }
  function N(i) {
    const c = i.length;
    if (0 < c) {
      const h = Array(c);
      for (let f = 0; f < c; f++) h[f] = i[f];
      return h;
    }
    return [];
  }
  function V(i, c) {
    for (let h = 1; h < arguments.length; h++) {
      const f = arguments[h];
      if (l(f)) {
        const I = i.length || 0, R = f.length || 0;
        i.length = I + R;
        for (let b = 0; b < R; b++) i[I + b] = f[b];
      } else i.push(f);
    }
  }
  class K {
    constructor(c, h) {
      this.i = c, this.j = h, this.h = 0, this.g = null;
    }
    get() {
      let c;
      return 0 < this.h ? (this.h--, c = this.g, this.g = c.next, c.next = null) : c = this.i(), c;
    }
  }
  function z(i) {
    return /^[\s\xa0]*$/.test(i);
  }
  function H() {
    var i = u.navigator;
    return i && (i = i.userAgent) ? i : "";
  }
  function ee(i) {
    return ee[" "](i), i;
  }
  ee[" "] = function() {
  };
  var Ce = H().indexOf("Gecko") != -1 && !(H().toLowerCase().indexOf("webkit") != -1 && H().indexOf("Edge") == -1) && !(H().indexOf("Trident") != -1 || H().indexOf("MSIE") != -1) && H().indexOf("Edge") == -1;
  function te(i, c, h) {
    for (const f in i) c.call(h, i[f], f, i);
  }
  function E(i, c) {
    for (const h in i) c.call(void 0, i[h], h, i);
  }
  function m(i) {
    const c = {};
    for (const h in i) c[h] = i[h];
    return c;
  }
  const _ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
  function v(i, c) {
    let h, f;
    for (let I = 1; I < arguments.length; I++) {
      f = arguments[I];
      for (h in f) i[h] = f[h];
      for (let R = 0; R < _.length; R++) h = _[R], Object.prototype.hasOwnProperty.call(f, h) && (i[h] = f[h]);
    }
  }
  function T(i) {
    var c = 1;
    i = i.split(":");
    const h = [];
    for (; 0 < c && i.length; ) h.push(i.shift()), c--;
    return i.length && h.push(i.join(":")), h;
  }
  function A(i) {
    u.setTimeout(() => {
      throw i;
    }, 0);
  }
  function g() {
    var i = Bs;
    let c = null;
    return i.g && (c = i.g, i.g = i.g.next, i.g || (i.h = null), c.next = null), c;
  }
  class $e {
    constructor() {
      this.h = this.g = null;
    }
    add(c, h) {
      const f = vn.get();
      f.set(c, h), this.h ? this.h.next = f : this.g = f, this.h = f;
    }
  }
  var vn = new K(() => new Fh(), (i) => i.reset());
  class Fh {
    constructor() {
      this.next = this.g = this.h = null;
    }
    set(c, h) {
      this.h = c, this.g = h, this.next = null;
    }
    reset() {
      this.next = this.g = this.h = null;
    }
  }
  let En, Tn = !1, Bs = new $e(), qo = () => {
    const i = u.Promise.resolve(void 0);
    En = () => {
      i.then(Bh);
    };
  };
  var Bh = () => {
    for (var i; i = g(); ) {
      try {
        i.h.call(i.g);
      } catch (h) {
        A(h);
      }
      var c = vn;
      c.j(i), 100 > c.h && (c.h++, i.next = c.g, c.g = i);
    }
    Tn = !1;
  };
  function tt() {
    this.s = this.s, this.C = this.C;
  }
  tt.prototype.s = !1, tt.prototype.ma = function() {
    this.s || (this.s = !0, this.N());
  }, tt.prototype.N = function() {
    if (this.C) for (; this.C.length; ) this.C.shift()();
  };
  function fe(i, c) {
    this.type = i, this.g = this.target = c, this.defaultPrevented = !1;
  }
  fe.prototype.h = function() {
    this.defaultPrevented = !0;
  };
  var jh = function() {
    if (!u.addEventListener || !Object.defineProperty) return !1;
    var i = !1, c = Object.defineProperty({}, "passive", { get: function() {
      i = !0;
    } });
    try {
      const h = () => {
      };
      u.addEventListener("test", h, c), u.removeEventListener("test", h, c);
    } catch {
    }
    return i;
  }();
  function In(i, c) {
    if (fe.call(this, i ? i.type : ""), this.relatedTarget = this.g = this.target = null, this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0, this.key = "", this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1, this.state = null, this.pointerId = 0, this.pointerType = "", this.i = null, i) {
      var h = this.type = i.type, f = i.changedTouches && i.changedTouches.length ? i.changedTouches[0] : null;
      if (this.target = i.target || i.srcElement, this.g = c, c = i.relatedTarget) {
        if (Ce) {
          e: {
            try {
              ee(c.nodeName);
              var I = !0;
              break e;
            } catch {
            }
            I = !1;
          }
          I || (c = null);
        }
      } else h == "mouseover" ? c = i.fromElement : h == "mouseout" && (c = i.toElement);
      this.relatedTarget = c, f ? (this.clientX = f.clientX !== void 0 ? f.clientX : f.pageX, this.clientY = f.clientY !== void 0 ? f.clientY : f.pageY, this.screenX = f.screenX || 0, this.screenY = f.screenY || 0) : (this.clientX = i.clientX !== void 0 ? i.clientX : i.pageX, this.clientY = i.clientY !== void 0 ? i.clientY : i.pageY, this.screenX = i.screenX || 0, this.screenY = i.screenY || 0), this.button = i.button, this.key = i.key || "", this.ctrlKey = i.ctrlKey, this.altKey = i.altKey, this.shiftKey = i.shiftKey, this.metaKey = i.metaKey, this.pointerId = i.pointerId || 0, this.pointerType = typeof i.pointerType == "string" ? i.pointerType : qh[i.pointerType] || "", this.state = i.state, this.i = i, i.defaultPrevented && In.aa.h.call(this);
    }
  }
  k(In, fe);
  var qh = { 2: "touch", 3: "pen", 4: "mouse" };
  In.prototype.h = function() {
    In.aa.h.call(this);
    var i = this.i;
    i.preventDefault ? i.preventDefault() : i.returnValue = !1;
  };
  var fr = "closure_listenable_" + (1e6 * Math.random() | 0), $h = 0;
  function zh(i, c, h, f, I) {
    this.listener = i, this.proxy = null, this.src = c, this.type = h, this.capture = !!f, this.ha = I, this.key = ++$h, this.da = this.fa = !1;
  }
  function pr(i) {
    i.da = !0, i.listener = null, i.proxy = null, i.src = null, i.ha = null;
  }
  function mr(i) {
    this.src = i, this.g = {}, this.h = 0;
  }
  mr.prototype.add = function(i, c, h, f, I) {
    var R = i.toString();
    i = this.g[R], i || (i = this.g[R] = [], this.h++);
    var b = qs(i, c, f, I);
    return -1 < b ? (c = i[b], h || (c.fa = !1)) : (c = new zh(c, this.src, R, !!f, I), c.fa = h, i.push(c)), c;
  };
  function js(i, c) {
    var h = c.type;
    if (h in i.g) {
      var f = i.g[h], I = Array.prototype.indexOf.call(f, c, void 0), R;
      (R = 0 <= I) && Array.prototype.splice.call(f, I, 1), R && (pr(c), i.g[h].length == 0 && (delete i.g[h], i.h--));
    }
  }
  function qs(i, c, h, f) {
    for (var I = 0; I < i.length; ++I) {
      var R = i[I];
      if (!R.da && R.listener == c && R.capture == !!h && R.ha == f) return I;
    }
    return -1;
  }
  var $s = "closure_lm_" + (1e6 * Math.random() | 0), zs = {};
  function $o(i, c, h, f, I) {
    if (Array.isArray(c)) {
      for (var R = 0; R < c.length; R++) $o(i, c[R], h, f, I);
      return null;
    }
    return h = Wo(h), i && i[fr] ? i.K(c, h, d(f) ? !!f.capture : !1, I) : Hh(i, c, h, !1, f, I);
  }
  function Hh(i, c, h, f, I, R) {
    if (!c) throw Error("Invalid event type");
    var b = d(I) ? !!I.capture : !!I, Q = Ws(i);
    if (Q || (i[$s] = Q = new mr(i)), h = Q.add(c, h, f, b, R), h.proxy) return h;
    if (f = Wh(), h.proxy = f, f.src = i, f.listener = h, i.addEventListener) jh || (I = b), I === void 0 && (I = !1), i.addEventListener(c.toString(), f, I);
    else if (i.attachEvent) i.attachEvent(Ho(c.toString()), f);
    else if (i.addListener && i.removeListener) i.addListener(f);
    else throw Error("addEventListener and attachEvent are unavailable.");
    return h;
  }
  function Wh() {
    function i(h) {
      return c.call(i.src, i.listener, h);
    }
    const c = Kh;
    return i;
  }
  function zo(i, c, h, f, I) {
    if (Array.isArray(c)) for (var R = 0; R < c.length; R++) zo(i, c[R], h, f, I);
    else f = d(f) ? !!f.capture : !!f, h = Wo(h), i && i[fr] ? (i = i.i, c = String(c).toString(), c in i.g && (R = i.g[c], h = qs(R, h, f, I), -1 < h && (pr(R[h]), Array.prototype.splice.call(R, h, 1), R.length == 0 && (delete i.g[c], i.h--)))) : i && (i = Ws(i)) && (c = i.g[c.toString()], i = -1, c && (i = qs(c, h, f, I)), (h = -1 < i ? c[i] : null) && Hs(h));
  }
  function Hs(i) {
    if (typeof i != "number" && i && !i.da) {
      var c = i.src;
      if (c && c[fr]) js(c.i, i);
      else {
        var h = i.type, f = i.proxy;
        c.removeEventListener ? c.removeEventListener(h, f, i.capture) : c.detachEvent ? c.detachEvent(Ho(h), f) : c.addListener && c.removeListener && c.removeListener(f), (h = Ws(c)) ? (js(h, i), h.h == 0 && (h.src = null, c[$s] = null)) : pr(i);
      }
    }
  }
  function Ho(i) {
    return i in zs ? zs[i] : zs[i] = "on" + i;
  }
  function Kh(i, c) {
    if (i.da) i = !0;
    else {
      c = new In(c, this);
      var h = i.listener, f = i.ha || i.src;
      i.fa && Hs(i), i = h.call(f, c);
    }
    return i;
  }
  function Ws(i) {
    return i = i[$s], i instanceof mr ? i : null;
  }
  var Ks = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
  function Wo(i) {
    return typeof i == "function" ? i : (i[Ks] || (i[Ks] = function(c) {
      return i.handleEvent(c);
    }), i[Ks]);
  }
  function pe() {
    tt.call(this), this.i = new mr(this), this.M = this, this.F = null;
  }
  k(pe, tt), pe.prototype[fr] = !0, pe.prototype.removeEventListener = function(i, c, h, f) {
    zo(this, i, c, h, f);
  };
  function Te(i, c) {
    var h, f = i.F;
    if (f) for (h = []; f; f = f.F) h.push(f);
    if (i = i.M, f = c.type || c, typeof c == "string") c = new fe(c, i);
    else if (c instanceof fe) c.target = c.target || i;
    else {
      var I = c;
      c = new fe(f, i), v(c, I);
    }
    if (I = !0, h) for (var R = h.length - 1; 0 <= R; R--) {
      var b = c.g = h[R];
      I = gr(b, f, !0, c) && I;
    }
    if (b = c.g = i, I = gr(b, f, !0, c) && I, I = gr(b, f, !1, c) && I, h) for (R = 0; R < h.length; R++) b = c.g = h[R], I = gr(b, f, !1, c) && I;
  }
  pe.prototype.N = function() {
    if (pe.aa.N.call(this), this.i) {
      var i = this.i, c;
      for (c in i.g) {
        for (var h = i.g[c], f = 0; f < h.length; f++) pr(h[f]);
        delete i.g[c], i.h--;
      }
    }
    this.F = null;
  }, pe.prototype.K = function(i, c, h, f) {
    return this.i.add(String(i), c, !1, h, f);
  }, pe.prototype.L = function(i, c, h, f) {
    return this.i.add(String(i), c, !0, h, f);
  };
  function gr(i, c, h, f) {
    if (c = i.i.g[String(c)], !c) return !0;
    c = c.concat();
    for (var I = !0, R = 0; R < c.length; ++R) {
      var b = c[R];
      if (b && !b.da && b.capture == h) {
        var Q = b.listener, ce = b.ha || b.src;
        b.fa && js(i.i, b), I = Q.call(ce, f) !== !1 && I;
      }
    }
    return I && !f.defaultPrevented;
  }
  function Ko(i, c, h) {
    if (typeof i == "function") h && (i = w(i, h));
    else if (i && typeof i.handleEvent == "function") i = w(i.handleEvent, i);
    else throw Error("Invalid listener argument");
    return 2147483647 < Number(c) ? -1 : u.setTimeout(i, c || 0);
  }
  function Go(i) {
    i.g = Ko(() => {
      i.g = null, i.i && (i.i = !1, Go(i));
    }, i.l);
    const c = i.h;
    i.h = null, i.m.apply(null, c);
  }
  class Gh extends tt {
    constructor(c, h) {
      super(), this.m = c, this.l = h, this.h = null, this.i = !1, this.g = null;
    }
    j(c) {
      this.h = arguments, this.g ? this.i = !0 : Go(this);
    }
    N() {
      super.N(), this.g && (u.clearTimeout(this.g), this.g = null, this.i = !1, this.h = null);
    }
  }
  function wn(i) {
    tt.call(this), this.h = i, this.g = {};
  }
  k(wn, tt);
  var Qo = [];
  function Jo(i) {
    te(i.g, function(c, h) {
      this.g.hasOwnProperty(h) && Hs(c);
    }, i), i.g = {};
  }
  wn.prototype.N = function() {
    wn.aa.N.call(this), Jo(this);
  }, wn.prototype.handleEvent = function() {
    throw Error("EventHandler.handleEvent not implemented");
  };
  var Gs = u.JSON.stringify, Qh = u.JSON.parse, Jh = class {
    stringify(i) {
      return u.JSON.stringify(i, void 0);
    }
    parse(i) {
      return u.JSON.parse(i, void 0);
    }
  };
  function Qs() {
  }
  Qs.prototype.h = null;
  function Xo(i) {
    return i.h || (i.h = i.i());
  }
  function Yo() {
  }
  var An = { OPEN: "a", kb: "b", Ja: "c", wb: "d" };
  function Js() {
    fe.call(this, "d");
  }
  k(Js, fe);
  function Xs() {
    fe.call(this, "c");
  }
  k(Xs, fe);
  var St = {}, Zo = null;
  function _r() {
    return Zo = Zo || new pe();
  }
  St.La = "serverreachability";
  function ea(i) {
    fe.call(this, St.La, i);
  }
  k(ea, fe);
  function Rn(i) {
    const c = _r();
    Te(c, new ea(c));
  }
  St.STAT_EVENT = "statevent";
  function ta(i, c) {
    fe.call(this, St.STAT_EVENT, i), this.stat = c;
  }
  k(ta, fe);
  function Ie(i) {
    const c = _r();
    Te(c, new ta(c, i));
  }
  St.Ma = "timingevent";
  function na(i, c) {
    fe.call(this, St.Ma, i), this.size = c;
  }
  k(na, fe);
  function Sn(i, c) {
    if (typeof i != "function") throw Error("Fn must not be null and must be a function");
    return u.setTimeout(function() {
      i();
    }, c);
  }
  function Pn() {
    this.g = !0;
  }
  Pn.prototype.xa = function() {
    this.g = !1;
  };
  function Xh(i, c, h, f, I, R) {
    i.info(function() {
      if (i.g) if (R)
        for (var b = "", Q = R.split("&"), ce = 0; ce < Q.length; ce++) {
          var W = Q[ce].split("=");
          if (1 < W.length) {
            var me = W[0];
            W = W[1];
            var ge = me.split("_");
            b = 2 <= ge.length && ge[1] == "type" ? b + (me + "=" + W + "&") : b + (me + "=redacted&");
          }
        }
      else b = null;
      else b = R;
      return "XMLHTTP REQ (" + f + ") [attempt " + I + "]: " + c + `
` + h + `
` + b;
    });
  }
  function Yh(i, c, h, f, I, R, b) {
    i.info(function() {
      return "XMLHTTP RESP (" + f + ") [ attempt " + I + "]: " + c + `
` + h + `
` + R + " " + b;
    });
  }
  function jt(i, c, h, f) {
    i.info(function() {
      return "XMLHTTP TEXT (" + c + "): " + ed(i, h) + (f ? " " + f : "");
    });
  }
  function Zh(i, c) {
    i.info(function() {
      return "TIMEOUT: " + c;
    });
  }
  Pn.prototype.info = function() {
  };
  function ed(i, c) {
    if (!i.g) return c;
    if (!c) return null;
    try {
      var h = JSON.parse(c);
      if (h) {
        for (i = 0; i < h.length; i++) if (Array.isArray(h[i])) {
          var f = h[i];
          if (!(2 > f.length)) {
            var I = f[1];
            if (Array.isArray(I) && !(1 > I.length)) {
              var R = I[0];
              if (R != "noop" && R != "stop" && R != "close") for (var b = 1; b < I.length; b++) I[b] = "";
            }
          }
        }
      }
      return Gs(h);
    } catch {
      return c;
    }
  }
  var yr = { NO_ERROR: 0, gb: 1, tb: 2, sb: 3, nb: 4, rb: 5, ub: 6, Ia: 7, TIMEOUT: 8, xb: 9 }, ra = { lb: "complete", Hb: "success", Ja: "error", Ia: "abort", zb: "ready", Ab: "readystatechange", TIMEOUT: "timeout", vb: "incrementaldata", yb: "progress", ob: "downloadprogress", Pb: "uploadprogress" }, Ys;
  function vr() {
  }
  k(vr, Qs), vr.prototype.g = function() {
    return new XMLHttpRequest();
  }, vr.prototype.i = function() {
    return {};
  }, Ys = new vr();
  function nt(i, c, h, f) {
    this.j = i, this.i = c, this.l = h, this.R = f || 1, this.U = new wn(this), this.I = 45e3, this.H = null, this.o = !1, this.m = this.A = this.v = this.L = this.F = this.S = this.B = null, this.D = [], this.g = null, this.C = 0, this.s = this.u = null, this.X = -1, this.J = !1, this.O = 0, this.M = null, this.W = this.K = this.T = this.P = !1, this.h = new sa();
  }
  function sa() {
    this.i = null, this.g = "", this.h = !1;
  }
  var ia = {}, Zs = {};
  function ei(i, c, h) {
    i.L = 1, i.v = wr(ze(c)), i.m = h, i.P = !0, oa(i, null);
  }
  function oa(i, c) {
    i.F = Date.now(), Er(i), i.A = ze(i.v);
    var h = i.A, f = i.R;
    Array.isArray(f) || (f = [String(f)]), Ea(h.i, "t", f), i.C = 0, h = i.j.J, i.h = new sa(), i.g = Ua(i.j, h ? c : null, !i.m), 0 < i.O && (i.M = new Gh(w(i.Y, i, i.g), i.O)), c = i.U, h = i.g, f = i.ca;
    var I = "readystatechange";
    Array.isArray(I) || (I && (Qo[0] = I.toString()), I = Qo);
    for (var R = 0; R < I.length; R++) {
      var b = $o(h, I[R], f || c.handleEvent, !1, c.h || c);
      if (!b) break;
      c.g[b.key] = b;
    }
    c = i.H ? m(i.H) : {}, i.m ? (i.u || (i.u = "POST"), c["Content-Type"] = "application/x-www-form-urlencoded", i.g.ea(
      i.A,
      i.u,
      i.m,
      c
    )) : (i.u = "GET", i.g.ea(i.A, i.u, null, c)), Rn(), Xh(i.i, i.u, i.A, i.l, i.R, i.m);
  }
  nt.prototype.ca = function(i) {
    i = i.target;
    const c = this.M;
    c && He(i) == 3 ? c.j() : this.Y(i);
  }, nt.prototype.Y = function(i) {
    try {
      if (i == this.g) e: {
        const ge = He(this.g);
        var c = this.g.Ba();
        const zt = this.g.Z();
        if (!(3 > ge) && (ge != 3 || this.g && (this.h.h || this.g.oa() || Pa(this.g)))) {
          this.J || ge != 4 || c == 7 || (c == 8 || 0 >= zt ? Rn(3) : Rn(2)), ti(this);
          var h = this.g.Z();
          this.X = h;
          t: if (aa(this)) {
            var f = Pa(this.g);
            i = "";
            var I = f.length, R = He(this.g) == 4;
            if (!this.h.i) {
              if (typeof TextDecoder > "u") {
                Pt(this), Cn(this);
                var b = "";
                break t;
              }
              this.h.i = new u.TextDecoder();
            }
            for (c = 0; c < I; c++) this.h.h = !0, i += this.h.i.decode(f[c], { stream: !(R && c == I - 1) });
            f.length = 0, this.h.g += i, this.C = 0, b = this.h.g;
          } else b = this.g.oa();
          if (this.o = h == 200, Yh(this.i, this.u, this.A, this.l, this.R, ge, h), this.o) {
            if (this.T && !this.K) {
              t: {
                if (this.g) {
                  var Q, ce = this.g;
                  if ((Q = ce.g ? ce.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !z(Q)) {
                    var W = Q;
                    break t;
                  }
                }
                W = null;
              }
              if (h = W) jt(this.i, this.l, h, "Initial handshake response via X-HTTP-Initial-Response"), this.K = !0, ni(this, h);
              else {
                this.o = !1, this.s = 3, Ie(12), Pt(this), Cn(this);
                break e;
              }
            }
            if (this.P) {
              h = !0;
              let be;
              for (; !this.J && this.C < b.length; ) if (be = td(this, b), be == Zs) {
                ge == 4 && (this.s = 4, Ie(14), h = !1), jt(this.i, this.l, null, "[Incomplete Response]");
                break;
              } else if (be == ia) {
                this.s = 4, Ie(15), jt(this.i, this.l, b, "[Invalid Chunk]"), h = !1;
                break;
              } else jt(this.i, this.l, be, null), ni(this, be);
              if (aa(this) && this.C != 0 && (this.h.g = this.h.g.slice(this.C), this.C = 0), ge != 4 || b.length != 0 || this.h.h || (this.s = 1, Ie(16), h = !1), this.o = this.o && h, !h) jt(this.i, this.l, b, "[Invalid Chunked Response]"), Pt(this), Cn(this);
              else if (0 < b.length && !this.W) {
                this.W = !0;
                var me = this.j;
                me.g == this && me.ba && !me.M && (me.j.info("Great, no buffering proxy detected. Bytes received: " + b.length), ci(me), me.M = !0, Ie(11));
              }
            } else jt(this.i, this.l, b, null), ni(this, b);
            ge == 4 && Pt(this), this.o && !this.J && (ge == 4 ? Oa(this.j, this) : (this.o = !1, Er(this)));
          } else yd(this.g), h == 400 && 0 < b.indexOf("Unknown SID") ? (this.s = 3, Ie(12)) : (this.s = 0, Ie(13)), Pt(this), Cn(this);
        }
      }
    } catch {
    } finally {
    }
  };
  function aa(i) {
    return i.g ? i.u == "GET" && i.L != 2 && i.j.Ca : !1;
  }
  function td(i, c) {
    var h = i.C, f = c.indexOf(`
`, h);
    return f == -1 ? Zs : (h = Number(c.substring(h, f)), isNaN(h) ? ia : (f += 1, f + h > c.length ? Zs : (c = c.slice(f, f + h), i.C = f + h, c)));
  }
  nt.prototype.cancel = function() {
    this.J = !0, Pt(this);
  };
  function Er(i) {
    i.S = Date.now() + i.I, ca(i, i.I);
  }
  function ca(i, c) {
    if (i.B != null) throw Error("WatchDog timer not null");
    i.B = Sn(w(i.ba, i), c);
  }
  function ti(i) {
    i.B && (u.clearTimeout(i.B), i.B = null);
  }
  nt.prototype.ba = function() {
    this.B = null;
    const i = Date.now();
    0 <= i - this.S ? (Zh(this.i, this.A), this.L != 2 && (Rn(), Ie(17)), Pt(this), this.s = 2, Cn(this)) : ca(this, this.S - i);
  };
  function Cn(i) {
    i.j.G == 0 || i.J || Oa(i.j, i);
  }
  function Pt(i) {
    ti(i);
    var c = i.M;
    c && typeof c.ma == "function" && c.ma(), i.M = null, Jo(i.U), i.g && (c = i.g, i.g = null, c.abort(), c.ma());
  }
  function ni(i, c) {
    try {
      var h = i.j;
      if (h.G != 0 && (h.g == i || ri(h.h, i))) {
        if (!i.K && ri(h.h, i) && h.G == 3) {
          try {
            var f = h.Da.g.parse(c);
          } catch {
            f = null;
          }
          if (Array.isArray(f) && f.length == 3) {
            var I = f;
            if (I[0] == 0) {
              e:
                if (!h.u) {
                  if (h.g) if (h.g.F + 3e3 < i.F) br(h), Pr(h);
                  else break e;
                  ai(h), Ie(18);
                }
            } else h.za = I[1], 0 < h.za - h.T && 37500 > I[2] && h.F && h.v == 0 && !h.C && (h.C = Sn(w(h.Za, h), 6e3));
            if (1 >= ha(h.h) && h.ca) {
              try {
                h.ca();
              } catch {
              }
              h.ca = void 0;
            }
          } else bt(h, 11);
        } else if ((i.K || h.g == i) && br(h), !z(c)) for (I = h.Da.g.parse(c), c = 0; c < I.length; c++) {
          let W = I[c];
          if (h.T = W[0], W = W[1], h.G == 2) if (W[0] == "c") {
            h.K = W[1], h.ia = W[2];
            const me = W[3];
            me != null && (h.la = me, h.j.info("VER=" + h.la));
            const ge = W[4];
            ge != null && (h.Aa = ge, h.j.info("SVER=" + h.Aa));
            const zt = W[5];
            zt != null && typeof zt == "number" && 0 < zt && (f = 1.5 * zt, h.L = f, h.j.info("backChannelRequestTimeoutMs_=" + f)), f = h;
            const be = i.g;
            if (be) {
              const Vr = be.g ? be.g.getResponseHeader("X-Client-Wire-Protocol") : null;
              if (Vr) {
                var R = f.h;
                R.g || Vr.indexOf("spdy") == -1 && Vr.indexOf("quic") == -1 && Vr.indexOf("h2") == -1 || (R.j = R.l, R.g = /* @__PURE__ */ new Set(), R.h && (si(R, R.h), R.h = null));
              }
              if (f.D) {
                const ui = be.g ? be.g.getResponseHeader("X-HTTP-Session-Id") : null;
                ui && (f.ya = ui, J(f.I, f.D, ui));
              }
            }
            h.G = 3, h.l && h.l.ua(), h.ba && (h.R = Date.now() - i.F, h.j.info("Handshake RTT: " + h.R + "ms")), f = h;
            var b = i;
            if (f.qa = xa(f, f.J ? f.ia : null, f.W), b.K) {
              da(f.h, b);
              var Q = b, ce = f.L;
              ce && (Q.I = ce), Q.B && (ti(Q), Er(Q)), f.g = b;
            } else Da(f);
            0 < h.i.length && Cr(h);
          } else W[0] != "stop" && W[0] != "close" || bt(h, 7);
          else h.G == 3 && (W[0] == "stop" || W[0] == "close" ? W[0] == "stop" ? bt(h, 7) : oi(h) : W[0] != "noop" && h.l && h.l.ta(W), h.v = 0);
        }
      }
      Rn(4);
    } catch {
    }
  }
  var nd = class {
    constructor(i, c) {
      this.g = i, this.map = c;
    }
  };
  function ua(i) {
    this.l = i || 10, u.PerformanceNavigationTiming ? (i = u.performance.getEntriesByType("navigation"), i = 0 < i.length && (i[0].nextHopProtocol == "hq" || i[0].nextHopProtocol == "h2")) : i = !!(u.chrome && u.chrome.loadTimes && u.chrome.loadTimes() && u.chrome.loadTimes().wasFetchedViaSpdy), this.j = i ? this.l : 1, this.g = null, 1 < this.j && (this.g = /* @__PURE__ */ new Set()), this.h = null, this.i = [];
  }
  function la(i) {
    return i.h ? !0 : i.g ? i.g.size >= i.j : !1;
  }
  function ha(i) {
    return i.h ? 1 : i.g ? i.g.size : 0;
  }
  function ri(i, c) {
    return i.h ? i.h == c : i.g ? i.g.has(c) : !1;
  }
  function si(i, c) {
    i.g ? i.g.add(c) : i.h = c;
  }
  function da(i, c) {
    i.h && i.h == c ? i.h = null : i.g && i.g.has(c) && i.g.delete(c);
  }
  ua.prototype.cancel = function() {
    if (this.i = fa(this), this.h) this.h.cancel(), this.h = null;
    else if (this.g && this.g.size !== 0) {
      for (const i of this.g.values()) i.cancel();
      this.g.clear();
    }
  };
  function fa(i) {
    if (i.h != null) return i.i.concat(i.h.D);
    if (i.g != null && i.g.size !== 0) {
      let c = i.i;
      for (const h of i.g.values()) c = c.concat(h.D);
      return c;
    }
    return N(i.i);
  }
  function rd(i) {
    if (i.V && typeof i.V == "function") return i.V();
    if (typeof Map < "u" && i instanceof Map || typeof Set < "u" && i instanceof Set) return Array.from(i.values());
    if (typeof i == "string") return i.split("");
    if (l(i)) {
      for (var c = [], h = i.length, f = 0; f < h; f++) c.push(i[f]);
      return c;
    }
    c = [], h = 0;
    for (f in i) c[h++] = i[f];
    return c;
  }
  function sd(i) {
    if (i.na && typeof i.na == "function") return i.na();
    if (!i.V || typeof i.V != "function") {
      if (typeof Map < "u" && i instanceof Map) return Array.from(i.keys());
      if (!(typeof Set < "u" && i instanceof Set)) {
        if (l(i) || typeof i == "string") {
          var c = [];
          i = i.length;
          for (var h = 0; h < i; h++) c.push(h);
          return c;
        }
        c = [], h = 0;
        for (const f in i) c[h++] = f;
        return c;
      }
    }
  }
  function pa(i, c) {
    if (i.forEach && typeof i.forEach == "function") i.forEach(c, void 0);
    else if (l(i) || typeof i == "string") Array.prototype.forEach.call(i, c, void 0);
    else for (var h = sd(i), f = rd(i), I = f.length, R = 0; R < I; R++) c.call(void 0, f[R], h && h[R], i);
  }
  var ma = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
  function id(i, c) {
    if (i) {
      i = i.split("&");
      for (var h = 0; h < i.length; h++) {
        var f = i[h].indexOf("="), I = null;
        if (0 <= f) {
          var R = i[h].substring(0, f);
          I = i[h].substring(f + 1);
        } else R = i[h];
        c(R, I ? decodeURIComponent(I.replace(/\+/g, " ")) : "");
      }
    }
  }
  function Ct(i) {
    if (this.g = this.o = this.j = "", this.s = null, this.m = this.l = "", this.h = !1, i instanceof Ct) {
      this.h = i.h, Tr(this, i.j), this.o = i.o, this.g = i.g, Ir(this, i.s), this.l = i.l;
      var c = i.i, h = new Vn();
      h.i = c.i, c.g && (h.g = new Map(c.g), h.h = c.h), ga(this, h), this.m = i.m;
    } else i && (c = String(i).match(ma)) ? (this.h = !1, Tr(this, c[1] || "", !0), this.o = bn(c[2] || ""), this.g = bn(c[3] || "", !0), Ir(this, c[4]), this.l = bn(c[5] || "", !0), ga(this, c[6] || "", !0), this.m = bn(c[7] || "")) : (this.h = !1, this.i = new Vn(null, this.h));
  }
  Ct.prototype.toString = function() {
    var i = [], c = this.j;
    c && i.push(kn(c, _a, !0), ":");
    var h = this.g;
    return (h || c == "file") && (i.push("//"), (c = this.o) && i.push(kn(c, _a, !0), "@"), i.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), h = this.s, h != null && i.push(":", String(h))), (h = this.l) && (this.g && h.charAt(0) != "/" && i.push("/"), i.push(kn(h, h.charAt(0) == "/" ? cd : ad, !0))), (h = this.i.toString()) && i.push("?", h), (h = this.m) && i.push("#", kn(h, ld)), i.join("");
  };
  function ze(i) {
    return new Ct(i);
  }
  function Tr(i, c, h) {
    i.j = h ? bn(c, !0) : c, i.j && (i.j = i.j.replace(/:$/, ""));
  }
  function Ir(i, c) {
    if (c) {
      if (c = Number(c), isNaN(c) || 0 > c) throw Error("Bad port number " + c);
      i.s = c;
    } else i.s = null;
  }
  function ga(i, c, h) {
    c instanceof Vn ? (i.i = c, hd(i.i, i.h)) : (h || (c = kn(c, ud)), i.i = new Vn(c, i.h));
  }
  function J(i, c, h) {
    i.i.set(c, h);
  }
  function wr(i) {
    return J(i, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36)), i;
  }
  function bn(i, c) {
    return i ? c ? decodeURI(i.replace(/%25/g, "%2525")) : decodeURIComponent(i) : "";
  }
  function kn(i, c, h) {
    return typeof i == "string" ? (i = encodeURI(i).replace(c, od), h && (i = i.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), i) : null;
  }
  function od(i) {
    return i = i.charCodeAt(0), "%" + (i >> 4 & 15).toString(16) + (i & 15).toString(16);
  }
  var _a = /[#\/\?@]/g, ad = /[#\?:]/g, cd = /[#\?]/g, ud = /[#\?@]/g, ld = /#/g;
  function Vn(i, c) {
    this.h = this.g = null, this.i = i || null, this.j = !!c;
  }
  function rt(i) {
    i.g || (i.g = /* @__PURE__ */ new Map(), i.h = 0, i.i && id(i.i, function(c, h) {
      i.add(decodeURIComponent(c.replace(/\+/g, " ")), h);
    }));
  }
  n = Vn.prototype, n.add = function(i, c) {
    rt(this), this.i = null, i = qt(this, i);
    var h = this.g.get(i);
    return h || this.g.set(i, h = []), h.push(c), this.h += 1, this;
  };
  function ya(i, c) {
    rt(i), c = qt(i, c), i.g.has(c) && (i.i = null, i.h -= i.g.get(c).length, i.g.delete(c));
  }
  function va(i, c) {
    return rt(i), c = qt(i, c), i.g.has(c);
  }
  n.forEach = function(i, c) {
    rt(this), this.g.forEach(function(h, f) {
      h.forEach(function(I) {
        i.call(c, I, f, this);
      }, this);
    }, this);
  }, n.na = function() {
    rt(this);
    const i = Array.from(this.g.values()), c = Array.from(this.g.keys()), h = [];
    for (let f = 0; f < c.length; f++) {
      const I = i[f];
      for (let R = 0; R < I.length; R++) h.push(c[f]);
    }
    return h;
  }, n.V = function(i) {
    rt(this);
    let c = [];
    if (typeof i == "string") va(this, i) && (c = c.concat(this.g.get(qt(this, i))));
    else {
      i = Array.from(this.g.values());
      for (let h = 0; h < i.length; h++) c = c.concat(i[h]);
    }
    return c;
  }, n.set = function(i, c) {
    return rt(this), this.i = null, i = qt(this, i), va(this, i) && (this.h -= this.g.get(i).length), this.g.set(i, [c]), this.h += 1, this;
  }, n.get = function(i, c) {
    return i ? (i = this.V(i), 0 < i.length ? String(i[0]) : c) : c;
  };
  function Ea(i, c, h) {
    ya(i, c), 0 < h.length && (i.i = null, i.g.set(qt(i, c), N(h)), i.h += h.length);
  }
  n.toString = function() {
    if (this.i) return this.i;
    if (!this.g) return "";
    const i = [], c = Array.from(this.g.keys());
    for (var h = 0; h < c.length; h++) {
      var f = c[h];
      const R = encodeURIComponent(String(f)), b = this.V(f);
      for (f = 0; f < b.length; f++) {
        var I = R;
        b[f] !== "" && (I += "=" + encodeURIComponent(String(b[f]))), i.push(I);
      }
    }
    return this.i = i.join("&");
  };
  function qt(i, c) {
    return c = String(c), i.j && (c = c.toLowerCase()), c;
  }
  function hd(i, c) {
    c && !i.j && (rt(i), i.i = null, i.g.forEach(function(h, f) {
      var I = f.toLowerCase();
      f != I && (ya(this, f), Ea(this, I, h));
    }, i)), i.j = c;
  }
  function dd(i, c) {
    const h = new Pn();
    if (u.Image) {
      const f = new Image();
      f.onload = P(st, h, "TestLoadImage: loaded", !0, c, f), f.onerror = P(st, h, "TestLoadImage: error", !1, c, f), f.onabort = P(st, h, "TestLoadImage: abort", !1, c, f), f.ontimeout = P(st, h, "TestLoadImage: timeout", !1, c, f), u.setTimeout(function() {
        f.ontimeout && f.ontimeout();
      }, 1e4), f.src = i;
    } else c(!1);
  }
  function fd(i, c) {
    const h = new Pn(), f = new AbortController(), I = setTimeout(() => {
      f.abort(), st(h, "TestPingServer: timeout", !1, c);
    }, 1e4);
    fetch(i, { signal: f.signal }).then((R) => {
      clearTimeout(I), R.ok ? st(h, "TestPingServer: ok", !0, c) : st(h, "TestPingServer: server error", !1, c);
    }).catch(() => {
      clearTimeout(I), st(h, "TestPingServer: error", !1, c);
    });
  }
  function st(i, c, h, f, I) {
    try {
      I && (I.onload = null, I.onerror = null, I.onabort = null, I.ontimeout = null), f(h);
    } catch {
    }
  }
  function pd() {
    this.g = new Jh();
  }
  function md(i, c, h) {
    const f = h || "";
    try {
      pa(i, function(I, R) {
        let b = I;
        d(I) && (b = Gs(I)), c.push(f + R + "=" + encodeURIComponent(b));
      });
    } catch (I) {
      throw c.push(f + "type=" + encodeURIComponent("_badmap")), I;
    }
  }
  function Ar(i) {
    this.l = i.Ub || null, this.j = i.eb || !1;
  }
  k(Ar, Qs), Ar.prototype.g = function() {
    return new Rr(this.l, this.j);
  }, Ar.prototype.i = /* @__PURE__ */ function(i) {
    return function() {
      return i;
    };
  }({});
  function Rr(i, c) {
    pe.call(this), this.D = i, this.o = c, this.m = void 0, this.status = this.readyState = 0, this.responseType = this.responseText = this.response = this.statusText = "", this.onreadystatechange = null, this.u = new Headers(), this.h = null, this.B = "GET", this.A = "", this.g = !1, this.v = this.j = this.l = null;
  }
  k(Rr, pe), n = Rr.prototype, n.open = function(i, c) {
    if (this.readyState != 0) throw this.abort(), Error("Error reopening a connection");
    this.B = i, this.A = c, this.readyState = 1, Nn(this);
  }, n.send = function(i) {
    if (this.readyState != 1) throw this.abort(), Error("need to call open() first. ");
    this.g = !0;
    const c = { headers: this.u, method: this.B, credentials: this.m, cache: void 0 };
    i && (c.body = i), (this.D || u).fetch(new Request(this.A, c)).then(this.Sa.bind(this), this.ga.bind(this));
  }, n.abort = function() {
    this.response = this.responseText = "", this.u = new Headers(), this.status = 0, this.j && this.j.cancel("Request was aborted.").catch(() => {
    }), 1 <= this.readyState && this.g && this.readyState != 4 && (this.g = !1, Dn(this)), this.readyState = 0;
  }, n.Sa = function(i) {
    if (this.g && (this.l = i, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = i.headers, this.readyState = 2, Nn(this)), this.g && (this.readyState = 3, Nn(this), this.g))) if (this.responseType === "arraybuffer") i.arrayBuffer().then(this.Qa.bind(this), this.ga.bind(this));
    else if (typeof u.ReadableStream < "u" && "body" in i) {
      if (this.j = i.body.getReader(), this.o) {
        if (this.responseType) throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        this.response = [];
      } else this.response = this.responseText = "", this.v = new TextDecoder();
      Ta(this);
    } else i.text().then(this.Ra.bind(this), this.ga.bind(this));
  };
  function Ta(i) {
    i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i));
  }
  n.Pa = function(i) {
    if (this.g) {
      if (this.o && i.value) this.response.push(i.value);
      else if (!this.o) {
        var c = i.value ? i.value : new Uint8Array(0);
        (c = this.v.decode(c, { stream: !i.done })) && (this.response = this.responseText += c);
      }
      i.done ? Dn(this) : Nn(this), this.readyState == 3 && Ta(this);
    }
  }, n.Ra = function(i) {
    this.g && (this.response = this.responseText = i, Dn(this));
  }, n.Qa = function(i) {
    this.g && (this.response = i, Dn(this));
  }, n.ga = function() {
    this.g && Dn(this);
  };
  function Dn(i) {
    i.readyState = 4, i.l = null, i.j = null, i.v = null, Nn(i);
  }
  n.setRequestHeader = function(i, c) {
    this.u.append(i, c);
  }, n.getResponseHeader = function(i) {
    return this.h && this.h.get(i.toLowerCase()) || "";
  }, n.getAllResponseHeaders = function() {
    if (!this.h) return "";
    const i = [], c = this.h.entries();
    for (var h = c.next(); !h.done; ) h = h.value, i.push(h[0] + ": " + h[1]), h = c.next();
    return i.join(`\r
`);
  };
  function Nn(i) {
    i.onreadystatechange && i.onreadystatechange.call(i);
  }
  Object.defineProperty(Rr.prototype, "withCredentials", { get: function() {
    return this.m === "include";
  }, set: function(i) {
    this.m = i ? "include" : "same-origin";
  } });
  function Ia(i) {
    let c = "";
    return te(i, function(h, f) {
      c += f, c += ":", c += h, c += `\r
`;
    }), c;
  }
  function ii(i, c, h) {
    e: {
      for (f in h) {
        var f = !1;
        break e;
      }
      f = !0;
    }
    f || (h = Ia(h), typeof i == "string" ? h != null && encodeURIComponent(String(h)) : J(i, c, h));
  }
  function Z(i) {
    pe.call(this), this.headers = /* @__PURE__ */ new Map(), this.o = i || null, this.h = !1, this.v = this.g = null, this.D = "", this.m = 0, this.l = "", this.j = this.B = this.u = this.A = !1, this.I = null, this.H = "", this.J = !1;
  }
  k(Z, pe);
  var gd = /^https?$/i, _d = ["POST", "PUT"];
  n = Z.prototype, n.Ha = function(i) {
    this.J = i;
  }, n.ea = function(i, c, h, f) {
    if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + i);
    c = c ? c.toUpperCase() : "GET", this.D = i, this.l = "", this.m = 0, this.A = !1, this.h = !0, this.g = this.o ? this.o.g() : Ys.g(), this.v = this.o ? Xo(this.o) : Xo(Ys), this.g.onreadystatechange = w(this.Ea, this);
    try {
      this.B = !0, this.g.open(c, String(i), !0), this.B = !1;
    } catch (R) {
      wa(this, R);
      return;
    }
    if (i = h || "", h = new Map(this.headers), f) if (Object.getPrototypeOf(f) === Object.prototype) for (var I in f) h.set(I, f[I]);
    else if (typeof f.keys == "function" && typeof f.get == "function") for (const R of f.keys()) h.set(R, f.get(R));
    else throw Error("Unknown input type for opt_headers: " + String(f));
    f = Array.from(h.keys()).find((R) => R.toLowerCase() == "content-type"), I = u.FormData && i instanceof u.FormData, !(0 <= Array.prototype.indexOf.call(_d, c, void 0)) || f || I || h.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    for (const [R, b] of h) this.g.setRequestHeader(R, b);
    this.H && (this.g.responseType = this.H), "withCredentials" in this.g && this.g.withCredentials !== this.J && (this.g.withCredentials = this.J);
    try {
      Sa(this), this.u = !0, this.g.send(i), this.u = !1;
    } catch (R) {
      wa(this, R);
    }
  };
  function wa(i, c) {
    i.h = !1, i.g && (i.j = !0, i.g.abort(), i.j = !1), i.l = c, i.m = 5, Aa(i), Sr(i);
  }
  function Aa(i) {
    i.A || (i.A = !0, Te(i, "complete"), Te(i, "error"));
  }
  n.abort = function(i) {
    this.g && this.h && (this.h = !1, this.j = !0, this.g.abort(), this.j = !1, this.m = i || 7, Te(this, "complete"), Te(this, "abort"), Sr(this));
  }, n.N = function() {
    this.g && (this.h && (this.h = !1, this.j = !0, this.g.abort(), this.j = !1), Sr(this, !0)), Z.aa.N.call(this);
  }, n.Ea = function() {
    this.s || (this.B || this.u || this.j ? Ra(this) : this.bb());
  }, n.bb = function() {
    Ra(this);
  };
  function Ra(i) {
    if (i.h && typeof a < "u" && (!i.v[1] || He(i) != 4 || i.Z() != 2)) {
      if (i.u && He(i) == 4) Ko(i.Ea, 0, i);
      else if (Te(i, "readystatechange"), He(i) == 4) {
        i.h = !1;
        try {
          const b = i.Z();
          e: switch (b) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var c = !0;
              break e;
            default:
              c = !1;
          }
          var h;
          if (!(h = c)) {
            var f;
            if (f = b === 0) {
              var I = String(i.D).match(ma)[1] || null;
              !I && u.self && u.self.location && (I = u.self.location.protocol.slice(0, -1)), f = !gd.test(I ? I.toLowerCase() : "");
            }
            h = f;
          }
          if (h) Te(i, "complete"), Te(i, "success");
          else {
            i.m = 6;
            try {
              var R = 2 < He(i) ? i.g.statusText : "";
            } catch {
              R = "";
            }
            i.l = R + " [" + i.Z() + "]", Aa(i);
          }
        } finally {
          Sr(i);
        }
      }
    }
  }
  function Sr(i, c) {
    if (i.g) {
      Sa(i);
      const h = i.g, f = i.v[0] ? () => {
      } : null;
      i.g = null, i.v = null, c || Te(i, "ready");
      try {
        h.onreadystatechange = f;
      } catch {
      }
    }
  }
  function Sa(i) {
    i.I && (u.clearTimeout(i.I), i.I = null);
  }
  n.isActive = function() {
    return !!this.g;
  };
  function He(i) {
    return i.g ? i.g.readyState : 0;
  }
  n.Z = function() {
    try {
      return 2 < He(this) ? this.g.status : -1;
    } catch {
      return -1;
    }
  }, n.oa = function() {
    try {
      return this.g ? this.g.responseText : "";
    } catch {
      return "";
    }
  }, n.Oa = function(i) {
    if (this.g) {
      var c = this.g.responseText;
      return i && c.indexOf(i) == 0 && (c = c.substring(i.length)), Qh(c);
    }
  };
  function Pa(i) {
    try {
      if (!i.g) return null;
      if ("response" in i.g) return i.g.response;
      switch (i.H) {
        case "":
        case "text":
          return i.g.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in i.g) return i.g.mozResponseArrayBuffer;
      }
      return null;
    } catch {
      return null;
    }
  }
  function yd(i) {
    const c = {};
    i = (i.g && 2 <= He(i) && i.g.getAllResponseHeaders() || "").split(`\r
`);
    for (let f = 0; f < i.length; f++) {
      if (z(i[f])) continue;
      var h = T(i[f]);
      const I = h[0];
      if (h = h[1], typeof h != "string") continue;
      h = h.trim();
      const R = c[I] || [];
      c[I] = R, R.push(h);
    }
    E(c, function(f) {
      return f.join(", ");
    });
  }
  n.Ba = function() {
    return this.m;
  }, n.Ka = function() {
    return typeof this.l == "string" ? this.l : String(this.l);
  };
  function On(i, c, h) {
    return h && h.internalChannelParams && h.internalChannelParams[i] || c;
  }
  function Ca(i) {
    this.Aa = 0, this.i = [], this.j = new Pn(), this.ia = this.qa = this.I = this.W = this.g = this.ya = this.D = this.H = this.m = this.S = this.o = null, this.Ya = this.U = 0, this.Va = On("failFast", !1, i), this.F = this.C = this.u = this.s = this.l = null, this.X = !0, this.za = this.T = -1, this.Y = this.v = this.B = 0, this.Ta = On("baseRetryDelayMs", 5e3, i), this.cb = On("retryDelaySeedMs", 1e4, i), this.Wa = On("forwardChannelMaxRetries", 2, i), this.wa = On("forwardChannelRequestTimeoutMs", 2e4, i), this.pa = i && i.xmlHttpFactory || void 0, this.Xa = i && i.Tb || void 0, this.Ca = i && i.useFetchStreams || !1, this.L = void 0, this.J = i && i.supportsCrossDomainXhr || !1, this.K = "", this.h = new ua(i && i.concurrentRequestLimit), this.Da = new pd(), this.P = i && i.fastHandshake || !1, this.O = i && i.encodeInitMessageHeaders || !1, this.P && this.O && (this.O = !1), this.Ua = i && i.Rb || !1, i && i.xa && this.j.xa(), i && i.forceLongPolling && (this.X = !1), this.ba = !this.P && this.X && i && i.detectBufferingProxy || !1, this.ja = void 0, i && i.longPollingTimeout && 0 < i.longPollingTimeout && (this.ja = i.longPollingTimeout), this.ca = void 0, this.R = 0, this.M = !1, this.ka = this.A = null;
  }
  n = Ca.prototype, n.la = 8, n.G = 1, n.connect = function(i, c, h, f) {
    Ie(0), this.W = i, this.H = c || {}, h && f !== void 0 && (this.H.OSID = h, this.H.OAID = f), this.F = this.X, this.I = xa(this, null, this.W), Cr(this);
  };
  function oi(i) {
    if (ba(i), i.G == 3) {
      var c = i.U++, h = ze(i.I);
      if (J(h, "SID", i.K), J(h, "RID", c), J(h, "TYPE", "terminate"), Ln(i, h), c = new nt(i, i.j, c), c.L = 2, c.v = wr(ze(h)), h = !1, u.navigator && u.navigator.sendBeacon) try {
        h = u.navigator.sendBeacon(c.v.toString(), "");
      } catch {
      }
      !h && u.Image && (new Image().src = c.v, h = !0), h || (c.g = Ua(c.j, null), c.g.ea(c.v)), c.F = Date.now(), Er(c);
    }
    Ma(i);
  }
  function Pr(i) {
    i.g && (ci(i), i.g.cancel(), i.g = null);
  }
  function ba(i) {
    Pr(i), i.u && (u.clearTimeout(i.u), i.u = null), br(i), i.h.cancel(), i.s && (typeof i.s == "number" && u.clearTimeout(i.s), i.s = null);
  }
  function Cr(i) {
    if (!la(i.h) && !i.s) {
      i.s = !0;
      var c = i.Ga;
      En || qo(), Tn || (En(), Tn = !0), Bs.add(c, i), i.B = 0;
    }
  }
  function vd(i, c) {
    return ha(i.h) >= i.h.j - (i.s ? 1 : 0) ? !1 : i.s ? (i.i = c.D.concat(i.i), !0) : i.G == 1 || i.G == 2 || i.B >= (i.Va ? 0 : i.Wa) ? !1 : (i.s = Sn(w(i.Ga, i, c), La(i, i.B)), i.B++, !0);
  }
  n.Ga = function(i) {
    if (this.s) if (this.s = null, this.G == 1) {
      if (!i) {
        this.U = Math.floor(1e5 * Math.random()), i = this.U++;
        const I = new nt(this, this.j, i);
        let R = this.o;
        if (this.S && (R ? (R = m(R), v(R, this.S)) : R = this.S), this.m !== null || this.O || (I.H = R, R = null), this.P) e: {
          for (var c = 0, h = 0; h < this.i.length; h++) {
            t: {
              var f = this.i[h];
              if ("__data__" in f.map && (f = f.map.__data__, typeof f == "string")) {
                f = f.length;
                break t;
              }
              f = void 0;
            }
            if (f === void 0) break;
            if (c += f, 4096 < c) {
              c = h;
              break e;
            }
            if (c === 4096 || h === this.i.length - 1) {
              c = h + 1;
              break e;
            }
          }
          c = 1e3;
        }
        else c = 1e3;
        c = Va(this, I, c), h = ze(this.I), J(h, "RID", i), J(h, "CVER", 22), this.D && J(h, "X-HTTP-Session-Id", this.D), Ln(this, h), R && (this.O ? c = "headers=" + encodeURIComponent(String(Ia(R))) + "&" + c : this.m && ii(h, this.m, R)), si(this.h, I), this.Ua && J(h, "TYPE", "init"), this.P ? (J(h, "$req", c), J(h, "SID", "null"), I.T = !0, ei(I, h, null)) : ei(I, h, c), this.G = 2;
      }
    } else this.G == 3 && (i ? ka(this, i) : this.i.length == 0 || la(this.h) || ka(this));
  };
  function ka(i, c) {
    var h;
    c ? h = c.l : h = i.U++;
    const f = ze(i.I);
    J(f, "SID", i.K), J(f, "RID", h), J(f, "AID", i.T), Ln(i, f), i.m && i.o && ii(f, i.m, i.o), h = new nt(i, i.j, h, i.B + 1), i.m === null && (h.H = i.o), c && (i.i = c.D.concat(i.i)), c = Va(i, h, 1e3), h.I = Math.round(0.5 * i.wa) + Math.round(0.5 * i.wa * Math.random()), si(i.h, h), ei(h, f, c);
  }
  function Ln(i, c) {
    i.H && te(i.H, function(h, f) {
      J(c, f, h);
    }), i.l && pa({}, function(h, f) {
      J(c, f, h);
    });
  }
  function Va(i, c, h) {
    h = Math.min(i.i.length, h);
    var f = i.l ? w(i.l.Na, i.l, i) : null;
    e: {
      var I = i.i;
      let R = -1;
      for (; ; ) {
        const b = ["count=" + h];
        R == -1 ? 0 < h ? (R = I[0].g, b.push("ofs=" + R)) : R = 0 : b.push("ofs=" + R);
        let Q = !0;
        for (let ce = 0; ce < h; ce++) {
          let W = I[ce].g;
          const me = I[ce].map;
          if (W -= R, 0 > W) R = Math.max(0, I[ce].g - 100), Q = !1;
          else try {
            md(me, b, "req" + W + "_");
          } catch {
            f && f(me);
          }
        }
        if (Q) {
          f = b.join("&");
          break e;
        }
      }
    }
    return i = i.i.splice(0, h), c.D = i, f;
  }
  function Da(i) {
    if (!i.g && !i.u) {
      i.Y = 1;
      var c = i.Fa;
      En || qo(), Tn || (En(), Tn = !0), Bs.add(c, i), i.v = 0;
    }
  }
  function ai(i) {
    return i.g || i.u || 3 <= i.v ? !1 : (i.Y++, i.u = Sn(w(i.Fa, i), La(i, i.v)), i.v++, !0);
  }
  n.Fa = function() {
    if (this.u = null, Na(this), this.ba && !(this.M || this.g == null || 0 >= this.R)) {
      var i = 2 * this.R;
      this.j.info("BP detection timer enabled: " + i), this.A = Sn(w(this.ab, this), i);
    }
  }, n.ab = function() {
    this.A && (this.A = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = !1, this.M = !0, Ie(10), Pr(this), Na(this));
  };
  function ci(i) {
    i.A != null && (u.clearTimeout(i.A), i.A = null);
  }
  function Na(i) {
    i.g = new nt(i, i.j, "rpc", i.Y), i.m === null && (i.g.H = i.o), i.g.O = 0;
    var c = ze(i.qa);
    J(c, "RID", "rpc"), J(c, "SID", i.K), J(c, "AID", i.T), J(c, "CI", i.F ? "0" : "1"), !i.F && i.ja && J(c, "TO", i.ja), J(c, "TYPE", "xmlhttp"), Ln(i, c), i.m && i.o && ii(c, i.m, i.o), i.L && (i.g.I = i.L);
    var h = i.g;
    i = i.ia, h.L = 1, h.v = wr(ze(c)), h.m = null, h.P = !0, oa(h, i);
  }
  n.Za = function() {
    this.C != null && (this.C = null, Pr(this), ai(this), Ie(19));
  };
  function br(i) {
    i.C != null && (u.clearTimeout(i.C), i.C = null);
  }
  function Oa(i, c) {
    var h = null;
    if (i.g == c) {
      br(i), ci(i), i.g = null;
      var f = 2;
    } else if (ri(i.h, c)) h = c.D, da(i.h, c), f = 1;
    else return;
    if (i.G != 0) {
      if (c.o) if (f == 1) {
        h = c.m ? c.m.length : 0, c = Date.now() - c.F;
        var I = i.B;
        f = _r(), Te(f, new na(f, h)), Cr(i);
      } else Da(i);
      else if (I = c.s, I == 3 || I == 0 && 0 < c.X || !(f == 1 && vd(i, c) || f == 2 && ai(i))) switch (h && 0 < h.length && (c = i.h, c.i = c.i.concat(h)), I) {
        case 1:
          bt(i, 5);
          break;
        case 4:
          bt(i, 10);
          break;
        case 3:
          bt(i, 6);
          break;
        default:
          bt(i, 2);
      }
    }
  }
  function La(i, c) {
    let h = i.Ta + Math.floor(Math.random() * i.cb);
    return i.isActive() || (h *= 2), h * c;
  }
  function bt(i, c) {
    if (i.j.info("Error code " + c), c == 2) {
      var h = w(i.fb, i), f = i.Xa;
      const I = !f;
      f = new Ct(f || "//www.google.com/images/cleardot.gif"), u.location && u.location.protocol == "http" || Tr(f, "https"), wr(f), I ? dd(f.toString(), h) : fd(f.toString(), h);
    } else Ie(2);
    i.G = 0, i.l && i.l.sa(c), Ma(i), ba(i);
  }
  n.fb = function(i) {
    i ? (this.j.info("Successfully pinged google.com"), Ie(2)) : (this.j.info("Failed to ping google.com"), Ie(1));
  };
  function Ma(i) {
    if (i.G = 0, i.ka = [], i.l) {
      const c = fa(i.h);
      (c.length != 0 || i.i.length != 0) && (V(i.ka, c), V(i.ka, i.i), i.h.i.length = 0, N(i.i), i.i.length = 0), i.l.ra();
    }
  }
  function xa(i, c, h) {
    var f = h instanceof Ct ? ze(h) : new Ct(h);
    if (f.g != "") c && (f.g = c + "." + f.g), Ir(f, f.s);
    else {
      var I = u.location;
      f = I.protocol, c = c ? c + "." + I.hostname : I.hostname, I = +I.port;
      var R = new Ct(null);
      f && Tr(R, f), c && (R.g = c), I && Ir(R, I), h && (R.l = h), f = R;
    }
    return h = i.D, c = i.ya, h && c && J(f, h, c), J(f, "VER", i.la), Ln(i, f), f;
  }
  function Ua(i, c, h) {
    if (c && !i.J) throw Error("Can't create secondary domain capable XhrIo object.");
    return c = i.Ca && !i.pa ? new Z(new Ar({ eb: h })) : new Z(i.pa), c.Ha(i.J), c;
  }
  n.isActive = function() {
    return !!this.l && this.l.isActive(this);
  };
  function Fa() {
  }
  n = Fa.prototype, n.ua = function() {
  }, n.ta = function() {
  }, n.sa = function() {
  }, n.ra = function() {
  }, n.isActive = function() {
    return !0;
  }, n.Na = function() {
  };
  function kr() {
  }
  kr.prototype.g = function(i, c) {
    return new Se(i, c);
  };
  function Se(i, c) {
    pe.call(this), this.g = new Ca(c), this.l = i, this.h = c && c.messageUrlParams || null, i = c && c.messageHeaders || null, c && c.clientProtocolHeaderRequired && (i ? i["X-Client-Protocol"] = "webchannel" : i = { "X-Client-Protocol": "webchannel" }), this.g.o = i, i = c && c.initMessageHeaders || null, c && c.messageContentType && (i ? i["X-WebChannel-Content-Type"] = c.messageContentType : i = { "X-WebChannel-Content-Type": c.messageContentType }), c && c.va && (i ? i["X-WebChannel-Client-Profile"] = c.va : i = { "X-WebChannel-Client-Profile": c.va }), this.g.S = i, (i = c && c.Sb) && !z(i) && (this.g.m = i), this.v = c && c.supportsCrossDomainXhr || !1, this.u = c && c.sendRawJson || !1, (c = c && c.httpSessionIdParam) && !z(c) && (this.g.D = c, i = this.h, i !== null && c in i && (i = this.h, c in i && delete i[c])), this.j = new $t(this);
  }
  k(Se, pe), Se.prototype.m = function() {
    this.g.l = this.j, this.v && (this.g.J = !0), this.g.connect(this.l, this.h || void 0);
  }, Se.prototype.close = function() {
    oi(this.g);
  }, Se.prototype.o = function(i) {
    var c = this.g;
    if (typeof i == "string") {
      var h = {};
      h.__data__ = i, i = h;
    } else this.u && (h = {}, h.__data__ = Gs(i), i = h);
    c.i.push(new nd(c.Ya++, i)), c.G == 3 && Cr(c);
  }, Se.prototype.N = function() {
    this.g.l = null, delete this.j, oi(this.g), delete this.g, Se.aa.N.call(this);
  };
  function Ba(i) {
    Js.call(this), i.__headers__ && (this.headers = i.__headers__, this.statusCode = i.__status__, delete i.__headers__, delete i.__status__);
    var c = i.__sm__;
    if (c) {
      e: {
        for (const h in c) {
          i = h;
          break e;
        }
        i = void 0;
      }
      (this.i = i) && (i = this.i, c = c !== null && i in c ? c[i] : void 0), this.data = c;
    } else this.data = i;
  }
  k(Ba, Js);
  function ja() {
    Xs.call(this), this.status = 1;
  }
  k(ja, Xs);
  function $t(i) {
    this.g = i;
  }
  k($t, Fa), $t.prototype.ua = function() {
    Te(this.g, "a");
  }, $t.prototype.ta = function(i) {
    Te(this.g, new Ba(i));
  }, $t.prototype.sa = function(i) {
    Te(this.g, new ja());
  }, $t.prototype.ra = function() {
    Te(this.g, "b");
  }, kr.prototype.createWebChannel = kr.prototype.g, Se.prototype.send = Se.prototype.o, Se.prototype.open = Se.prototype.m, Se.prototype.close = Se.prototype.close, hl = function() {
    return new kr();
  }, ll = function() {
    return _r();
  }, ul = St, Ci = { mb: 0, pb: 1, qb: 2, Jb: 3, Ob: 4, Lb: 5, Mb: 6, Kb: 7, Ib: 8, Nb: 9, PROXY: 10, NOPROXY: 11, Gb: 12, Cb: 13, Db: 14, Bb: 15, Eb: 16, Fb: 17, ib: 18, hb: 19, jb: 20 }, yr.NO_ERROR = 0, yr.TIMEOUT = 8, yr.HTTP_ERROR = 6, zr = yr, ra.COMPLETE = "complete", cl = ra, Yo.EventType = An, An.OPEN = "a", An.CLOSE = "b", An.ERROR = "c", An.MESSAGE = "d", pe.prototype.listen = pe.prototype.K, Un = Yo, Z.prototype.listenOnce = Z.prototype.L, Z.prototype.getLastError = Z.prototype.Ka, Z.prototype.getLastErrorCode = Z.prototype.Ba, Z.prototype.getStatus = Z.prototype.Z, Z.prototype.getResponseJson = Z.prototype.Oa, Z.prototype.getResponseText = Z.prototype.oa, Z.prototype.send = Z.prototype.ea, Z.prototype.setWithCredentials = Z.prototype.Ha, al = Z;
}).apply(typeof Nr < "u" ? Nr : typeof self < "u" ? self : typeof window < "u" ? window : {});
const vc = "@firebase/firestore", Ec = "4.7.10";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ye {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return this.uid != null;
  }
  /**
   * Returns a key representing this user, suitable for inclusion in a
   * dictionary.
   */
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
ye.UNAUTHENTICATED = new ye(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
ye.GOOGLE_CREDENTIALS = new ye("google-credentials-uid"), ye.FIRST_PARTY = new ye("first-party-uid"), ye.MOCK_USER = new ye("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let pn = "11.5.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Mt = new Hi("@firebase/firestore");
function Ht() {
  return Mt.logLevel;
}
function D(n, ...e) {
  if (Mt.logLevel <= j.DEBUG) {
    const t = e.map(ro);
    Mt.debug(`Firestore (${pn}): ${n}`, ...t);
  }
}
function Ye(n, ...e) {
  if (Mt.logLevel <= j.ERROR) {
    const t = e.map(ro);
    Mt.error(`Firestore (${pn}): ${n}`, ...t);
  }
}
function nn(n, ...e) {
  if (Mt.logLevel <= j.WARN) {
    const t = e.map(ro);
    Mt.warn(`Firestore (${pn}): ${n}`, ...t);
  }
}
function ro(n) {
  if (typeof n == "string") return n;
  try {
    /**
    * @license
    * Copyright 2020 Google LLC
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */
    return function(t) {
      return JSON.stringify(t);
    }(n);
  } catch {
    return n;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function x(n = "Unexpected state") {
  const e = `FIRESTORE (${pn}) INTERNAL ASSERTION FAILED: ` + n;
  throw Ye(e), new Error(e);
}
function G(n, e) {
  n || x();
}
function F(n, e) {
  return n;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const C = {
  // Causes are copied from:
  // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
  /** Not an error; returned on success. */
  OK: "ok",
  /** The operation was cancelled (typically by the caller). */
  CANCELLED: "cancelled",
  /** Unknown error or an error from a different error domain. */
  UNKNOWN: "unknown",
  /**
   * Client specified an invalid argument. Note that this differs from
   * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
   * problematic regardless of the state of the system (e.g., a malformed file
   * name).
   */
  INVALID_ARGUMENT: "invalid-argument",
  /**
   * Deadline expired before operation could complete. For operations that
   * change the state of the system, this error may be returned even if the
   * operation has completed successfully. For example, a successful response
   * from a server could have been delayed long enough for the deadline to
   * expire.
   */
  DEADLINE_EXCEEDED: "deadline-exceeded",
  /** Some requested entity (e.g., file or directory) was not found. */
  NOT_FOUND: "not-found",
  /**
   * Some entity that we attempted to create (e.g., file or directory) already
   * exists.
   */
  ALREADY_EXISTS: "already-exists",
  /**
   * The caller does not have permission to execute the specified operation.
   * PERMISSION_DENIED must not be used for rejections caused by exhausting
   * some resource (use RESOURCE_EXHAUSTED instead for those errors).
   * PERMISSION_DENIED must not be used if the caller cannot be identified
   * (use UNAUTHENTICATED instead for those errors).
   */
  PERMISSION_DENIED: "permission-denied",
  /**
   * The request does not have valid authentication credentials for the
   * operation.
   */
  UNAUTHENTICATED: "unauthenticated",
  /**
   * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
   * entire file system is out of space.
   */
  RESOURCE_EXHAUSTED: "resource-exhausted",
  /**
   * Operation was rejected because the system is not in a state required for
   * the operation's execution. For example, directory to be deleted may be
   * non-empty, an rmdir operation is applied to a non-directory, etc.
   *
   * A litmus test that may help a service implementor in deciding
   * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
   *  (a) Use UNAVAILABLE if the client can retry just the failing call.
   *  (b) Use ABORTED if the client should retry at a higher-level
   *      (e.g., restarting a read-modify-write sequence).
   *  (c) Use FAILED_PRECONDITION if the client should not retry until
   *      the system state has been explicitly fixed. E.g., if an "rmdir"
   *      fails because the directory is non-empty, FAILED_PRECONDITION
   *      should be returned since the client should not retry unless
   *      they have first fixed up the directory by deleting files from it.
   *  (d) Use FAILED_PRECONDITION if the client performs conditional
   *      REST Get/Update/Delete on a resource and the resource on the
   *      server does not match the condition. E.g., conflicting
   *      read-modify-write on the same resource.
   */
  FAILED_PRECONDITION: "failed-precondition",
  /**
   * The operation was aborted, typically due to a concurrency issue like
   * sequencer check failures, transaction aborts, etc.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  ABORTED: "aborted",
  /**
   * Operation was attempted past the valid range. E.g., seeking or reading
   * past end of file.
   *
   * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
   * if the system state changes. For example, a 32-bit file system will
   * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
   * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
   * an offset past the current file size.
   *
   * There is a fair bit of overlap between FAILED_PRECONDITION and
   * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
   * when it applies so that callers who are iterating through a space can
   * easily look for an OUT_OF_RANGE error to detect when they are done.
   */
  OUT_OF_RANGE: "out-of-range",
  /** Operation is not implemented or not supported/enabled in this service. */
  UNIMPLEMENTED: "unimplemented",
  /**
   * Internal errors. Means some invariants expected by underlying System has
   * been broken. If you see one of these errors, Something is very broken.
   */
  INTERNAL: "internal",
  /**
   * The service is currently unavailable. This is a most likely a transient
   * condition and may be corrected by retrying with a backoff.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  UNAVAILABLE: "unavailable",
  /** Unrecoverable data loss or corruption. */
  DATA_LOSS: "data-loss"
};
class O extends et {
  /** @hideconstructor */
  constructor(e, t) {
    super(e, t), this.code = e, this.message = t, // HACK: We write a toString property directly because Error is not a real
    // class and so inheritance does not work correctly. We could alternatively
    // do the same "back-door inheritance" trick that FirebaseError does.
    this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Qe {
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class dl {
  constructor(e, t) {
    this.user = t, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
  }
}
class mg {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(e, t) {
    e.enqueueRetryable(() => t(ye.UNAUTHENTICATED));
  }
  shutdown() {
  }
}
class gg {
  constructor(e) {
    this.token = e, /**
     * Stores the listener registered with setChangeListener()
     * This isn't actually necessary since the UID never changes, but we use this
     * to verify the listen contract is adhered to in tests.
     */
    this.changeListener = null;
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {
  }
  start(e, t) {
    this.changeListener = t, // Fire with initial user.
    e.enqueueRetryable(() => t(this.token.user));
  }
  shutdown() {
    this.changeListener = null;
  }
}
class _g {
  constructor(e) {
    this.t = e, /** Tracks the current User. */
    this.currentUser = ye.UNAUTHENTICATED, /**
     * Counter used to detect if the token changed while a getToken request was
     * outstanding.
     */
    this.i = 0, this.forceRefresh = !1, this.auth = null;
  }
  start(e, t) {
    G(this.o === void 0);
    let r = this.i;
    const s = (l) => this.i !== r ? (r = this.i, t(l)) : Promise.resolve();
    let o = new Qe();
    this.o = () => {
      this.i++, this.currentUser = this.u(), o.resolve(), o = new Qe(), e.enqueueRetryable(() => s(this.currentUser));
    };
    const a = () => {
      const l = o;
      e.enqueueRetryable(async () => {
        await l.promise, await s(this.currentUser);
      });
    }, u = (l) => {
      D("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = l, this.o && (this.auth.addAuthTokenListener(this.o), a());
    };
    this.t.onInit((l) => u(l)), // Our users can initialize Auth right after Firestore, so we give it
    // a chance to register itself with the component framework before we
    // determine whether to start up in unauthenticated mode.
    setTimeout(() => {
      if (!this.auth) {
        const l = this.t.getImmediate({
          optional: !0
        });
        l ? u(l) : (
          // If auth is still not available, proceed with `null` user
          (D("FirebaseAuthCredentialsProvider", "Auth not yet detected"), o.resolve(), o = new Qe())
        );
      }
    }, 0), a();
  }
  getToken() {
    const e = this.i, t = this.forceRefresh;
    return this.forceRefresh = !1, this.auth ? this.auth.getToken(t).then((r) => (
      // Cancel the request since the token changed while the request was
      // outstanding so the response is potentially for a previous user (which
      // user, we can't be sure).
      this.i !== e ? (D("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : r ? (G(typeof r.accessToken == "string"), new dl(r.accessToken, this.currentUser)) : null
    )) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = !0;
  }
  shutdown() {
    this.auth && this.o && this.auth.removeAuthTokenListener(this.o), this.o = void 0;
  }
  // Auth.getUid() can return null even with a user logged in. It is because
  // getUid() is synchronous, but the auth code populating Uid is asynchronous.
  // This method should only be called in the AuthTokenListener callback
  // to guarantee to get the actual user.
  u() {
    const e = this.auth && this.auth.getUid();
    return G(e === null || typeof e == "string"), new ye(e);
  }
}
class yg {
  constructor(e, t, r) {
    this.l = e, this.h = t, this.P = r, this.type = "FirstParty", this.user = ye.FIRST_PARTY, this.T = /* @__PURE__ */ new Map();
  }
  /**
   * Gets an authorization token, using a provided factory function, or return
   * null.
   */
  I() {
    return this.P ? this.P() : null;
  }
  get headers() {
    this.T.set("X-Goog-AuthUser", this.l);
    const e = this.I();
    return e && this.T.set("Authorization", e), this.h && this.T.set("X-Goog-Iam-Authorization-Token", this.h), this.T;
  }
}
class vg {
  constructor(e, t, r) {
    this.l = e, this.h = t, this.P = r;
  }
  getToken() {
    return Promise.resolve(new yg(this.l, this.h, this.P));
  }
  start(e, t) {
    e.enqueueRetryable(() => t(ye.FIRST_PARTY));
  }
  shutdown() {
  }
  invalidateToken() {
  }
}
class Tc {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
}
class Eg {
  constructor(e, t) {
    this.A = t, this.forceRefresh = !1, this.appCheck = null, this.R = null, this.V = null, ke(e) && e.settings.appCheckToken && (this.V = e.settings.appCheckToken);
  }
  start(e, t) {
    G(this.o === void 0);
    const r = (o) => {
      o.error != null && D("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);
      const a = o.token !== this.R;
      return this.R = o.token, D("FirebaseAppCheckTokenProvider", `Received ${a ? "new" : "existing"} token.`), a ? t(o.token) : Promise.resolve();
    };
    this.o = (o) => {
      e.enqueueRetryable(() => r(o));
    };
    const s = (o) => {
      D("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = o, this.o && this.appCheck.addTokenListener(this.o);
    };
    this.A.onInit((o) => s(o)), // Our users can initialize AppCheck after Firestore, so we give it
    // a chance to register itself with the component framework.
    setTimeout(() => {
      if (!this.appCheck) {
        const o = this.A.getImmediate({
          optional: !0
        });
        o ? s(o) : (
          // If AppCheck is still not available, proceed without it.
          D("FirebaseAppCheckTokenProvider", "AppCheck not yet detected")
        );
      }
    }, 0);
  }
  getToken() {
    if (this.V) return Promise.resolve(new Tc(this.V));
    const e = this.forceRefresh;
    return this.forceRefresh = !1, this.appCheck ? this.appCheck.getToken(e).then((t) => t ? (G(typeof t.token == "string"), this.R = t.token, new Tc(t.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = !0;
  }
  shutdown() {
    this.appCheck && this.o && this.appCheck.removeTokenListener(this.o), this.o = void 0;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Tg(n) {
  const e = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof self < "u" && (self.crypto || self.msCrypto)
  ), t = new Uint8Array(n);
  if (e && typeof e.getRandomValues == "function") e.getRandomValues(t);
  else
    for (let r = 0; r < n; r++) t[r] = Math.floor(256 * Math.random());
  return t;
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function fl() {
  return new TextEncoder();
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class pl {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = 62 * Math.floor(4.129032258064516);
    let r = "";
    for (; r.length < 20; ) {
      const s = Tg(40);
      for (let o = 0; o < s.length; ++o)
        r.length < 20 && s[o] < t && (r += e.charAt(s[o] % 62));
    }
    return r;
  }
}
function B(n, e) {
  return n < e ? -1 : n > e ? 1 : 0;
}
function bi(n, e) {
  let t = 0;
  for (; t < n.length && t < e.length; ) {
    const r = n.codePointAt(t), s = e.codePointAt(t);
    if (r !== s) {
      if (r < 128 && s < 128)
        return B(r, s);
      {
        const o = fl(), a = Ig(o.encode(Ic(n, t)), o.encode(Ic(e, t)));
        return a !== 0 ? a : B(r, s);
      }
    }
    t += r > 65535 ? 2 : 1;
  }
  return B(n.length, e.length);
}
function Ic(n, e) {
  return n.codePointAt(e) > 65535 ? n.substring(e, e + 2) : n.substring(e, e + 1);
}
function Ig(n, e) {
  for (let t = 0; t < n.length && t < e.length; ++t) if (n[t] !== e[t]) return B(n[t], e[t]);
  return B(n.length, e.length);
}
function rn(n, e, t) {
  return n.length === e.length && n.every((r, s) => t(r, e[s]));
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const wc = -62135596800, Ac = 1e6;
class ie {
  /**
   * Creates a new timestamp with the current date, with millisecond precision.
   *
   * @returns a new timestamp representing the current date.
   */
  static now() {
    return ie.fromMillis(Date.now());
  }
  /**
   * Creates a new timestamp from the given date.
   *
   * @param date - The date to initialize the `Timestamp` from.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     date.
   */
  static fromDate(e) {
    return ie.fromMillis(e.getTime());
  }
  /**
   * Creates a new timestamp from the given number of milliseconds.
   *
   * @param milliseconds - Number of milliseconds since Unix epoch
   *     1970-01-01T00:00:00Z.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     number of milliseconds.
   */
  static fromMillis(e) {
    const t = Math.floor(e / 1e3), r = Math.floor((e - 1e3 * t) * Ac);
    return new ie(t, r);
  }
  /**
   * Creates a new timestamp.
   *
   * @param seconds - The number of seconds of UTC time since Unix epoch
   *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
   *     9999-12-31T23:59:59Z inclusive.
   * @param nanoseconds - The non-negative fractions of a second at nanosecond
   *     resolution. Negative second values with fractions must still have
   *     non-negative nanoseconds values that count forward in time. Must be
   *     from 0 to 999,999,999 inclusive.
   */
  constructor(e, t) {
    if (this.seconds = e, this.nanoseconds = t, t < 0) throw new O(C.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (t >= 1e9) throw new O(C.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (e < wc) throw new O(C.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    if (e >= 253402300800) throw new O(C.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
  }
  /**
   * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
   * causes a loss of precision since `Date` objects only support millisecond
   * precision.
   *
   * @returns JavaScript `Date` object representing the same point in time as
   *     this `Timestamp`, with millisecond precision.
   */
  toDate() {
    return new Date(this.toMillis());
  }
  /**
   * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
   * epoch). This operation causes a loss of precision.
   *
   * @returns The point in time corresponding to this timestamp, represented as
   *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
   */
  toMillis() {
    return 1e3 * this.seconds + this.nanoseconds / Ac;
  }
  _compareTo(e) {
    return this.seconds === e.seconds ? B(this.nanoseconds, e.nanoseconds) : B(this.seconds, e.seconds);
  }
  /**
   * Returns true if this `Timestamp` is equal to the provided one.
   *
   * @param other - The `Timestamp` to compare against.
   * @returns true if this `Timestamp` is equal to the provided one.
   */
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  /** Returns a textual representation of this `Timestamp`. */
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  /** Returns a JSON-serializable representation of this `Timestamp`. */
  toJSON() {
    return {
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  /**
   * Converts this object to a primitive string, which allows `Timestamp` objects
   * to be compared using the `>`, `<=`, `>=` and `>` operators.
   */
  valueOf() {
    const e = this.seconds - wc;
    return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class U {
  static fromTimestamp(e) {
    return new U(e);
  }
  static min() {
    return new U(new ie(0, 0));
  }
  static max() {
    return new U(new ie(253402300799, 999999999));
  }
  constructor(e) {
    this.timestamp = e;
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  /** Returns a number representation of the version for use in spec tests. */
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Rc = "__name__";
class Le {
  constructor(e, t, r) {
    t === void 0 ? t = 0 : t > e.length && x(), r === void 0 ? r = e.length - t : r > e.length - t && x(), this.segments = e, this.offset = t, this.len = r;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return Le.comparator(this, e) === 0;
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return e instanceof Le ? e.forEach((r) => {
      t.push(r);
    }) : t.push(e), this.construct(t);
  }
  /** The index of one past the last segment of the path. */
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = e === void 0 ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return this.length === 0;
  }
  isPrefixOf(e) {
    if (e.length < this.length) return !1;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
    return !0;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length) return !1;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return !1;
    return !0;
  }
  forEach(e) {
    for (let t = this.offset, r = this.limit(); t < r; t++) e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  /**
   * Compare 2 paths segment by segment, prioritizing numeric IDs
   * (e.g., "__id123__") in numeric ascending order, followed by string
   * segments in lexicographical order.
   */
  static comparator(e, t) {
    const r = Math.min(e.length, t.length);
    for (let s = 0; s < r; s++) {
      const o = Le.compareSegments(e.get(s), t.get(s));
      if (o !== 0) return o;
    }
    return B(e.length, t.length);
  }
  static compareSegments(e, t) {
    const r = Le.isNumericId(e), s = Le.isNumericId(t);
    return r && !s ? -1 : !r && s ? 1 : r && s ? Le.extractNumericId(e).compare(Le.extractNumericId(t)) : bi(e, t);
  }
  // Checks if a segment is a numeric ID (starts with "__id" and ends with "__").
  static isNumericId(e) {
    return e.startsWith("__id") && e.endsWith("__");
  }
  static extractNumericId(e) {
    return mt.fromString(e.substring(4, e.length - 2));
  }
}
class X extends Le {
  construct(e, t, r) {
    return new X(e, t, r);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Returns a string representation of this path
   * where each path segment has been encoded with
   * `encodeURIComponent`.
   */
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join("/");
  }
  /**
   * Creates a resource path from the given slash-delimited string. If multiple
   * arguments are provided, all components are combined. Leading and trailing
   * slashes from all components are ignored.
   */
  static fromString(...e) {
    const t = [];
    for (const r of e) {
      if (r.indexOf("//") >= 0) throw new O(C.INVALID_ARGUMENT, `Invalid segment (${r}). Paths must not contain // in them.`);
      t.push(...r.split("/").filter((s) => s.length > 0));
    }
    return new X(t);
  }
  static emptyPath() {
    return new X([]);
  }
}
const wg = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
class le extends Le {
  construct(e, t, r) {
    return new le(e, t, r);
  }
  /**
   * Returns true if the string could be used as a segment in a field path
   * without escaping.
   */
  static isValidIdentifier(e) {
    return wg.test(e);
  }
  canonicalString() {
    return this.toArray().map((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), le.isValidIdentifier(e) || (e = "`" + e + "`"), e)).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Returns true if this field references the key of a document.
   */
  isKeyField() {
    return this.length === 1 && this.get(0) === Rc;
  }
  /**
   * The field designating the key of a document.
   */
  static keyField() {
    return new le([Rc]);
  }
  /**
   * Parses a field string from the given server-formatted string.
   *
   * - Splitting the empty string is not allowed (for now at least).
   * - Empty segments within the string (e.g. if there are two consecutive
   *   separators) are not allowed.
   *
   * TODO(b/37244157): we should make this more strict. Right now, it allows
   * non-identifier path components, even if they aren't escaped.
   */
  static fromServerFormat(e) {
    const t = [];
    let r = "", s = 0;
    const o = () => {
      if (r.length === 0) throw new O(C.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      t.push(r), r = "";
    };
    let a = !1;
    for (; s < e.length; ) {
      const u = e[s];
      if (u === "\\") {
        if (s + 1 === e.length) throw new O(C.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
        const l = e[s + 1];
        if (l !== "\\" && l !== "." && l !== "`") throw new O(C.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
        r += l, s += 2;
      } else u === "`" ? (a = !a, s++) : u !== "." || a ? (r += u, s++) : (o(), s++);
    }
    if (o(), a) throw new O(C.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
    return new le(t);
  }
  static emptyPath() {
    return new le([]);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class L {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new L(X.fromString(e));
  }
  static fromName(e) {
    return new L(X.fromString(e).popFirst(5));
  }
  static empty() {
    return new L(X.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  /** Returns true if the document is in the specified collectionId. */
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  /** Returns the collection group (i.e. the name of the parent collection) for this key. */
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  /** Returns the fully qualified path to the parent collection. */
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return e !== null && X.comparator(this.path, e.path) === 0;
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return X.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  /**
   * Creates and returns a new document key with the given segments.
   *
   * @param segments - The segments of the path to the document
   * @returns A new instance of DocumentKey
   */
  static fromSegments(e) {
    return new L(new X(e.slice()));
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Xn = -1;
function Ag(n, e) {
  const t = n.toTimestamp().seconds, r = n.toTimestamp().nanoseconds + 1, s = U.fromTimestamp(r === 1e9 ? new ie(t + 1, 0) : new ie(t, r));
  return new _t(s, L.empty(), e);
}
function Rg(n) {
  return new _t(n.readTime, n.key, Xn);
}
class _t {
  constructor(e, t, r) {
    this.readTime = e, this.documentKey = t, this.largestBatchId = r;
  }
  /** Returns an offset that sorts before all regular offsets. */
  static min() {
    return new _t(U.min(), L.empty(), Xn);
  }
  /** Returns an offset that sorts after all regular offsets. */
  static max() {
    return new _t(U.max(), L.empty(), Xn);
  }
}
function Sg(n, e) {
  let t = n.readTime.compareTo(e.readTime);
  return t !== 0 ? t : (t = L.comparator(n.documentKey, e.documentKey), t !== 0 ? t : B(n.largestBatchId, e.largestBatchId));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Pg = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
class Cg {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach((e) => e());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function mn(n) {
  if (n.code !== C.FAILED_PRECONDITION || n.message !== Pg) throw n;
  D("LocalStore", "Unexpectedly lost primary lease");
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class S {
  constructor(e) {
    this.nextCallback = null, this.catchCallback = null, // When the operation resolves, we'll set result or error and mark isDone.
    this.result = void 0, this.error = void 0, this.isDone = !1, // Set to true when .then() or .catch() are called and prevents additional
    // chaining.
    this.callbackAttached = !1, e((t) => {
      this.isDone = !0, this.result = t, this.nextCallback && // value should be defined unless T is Void, but we can't express
      // that in the type system.
      this.nextCallback(t);
    }, (t) => {
      this.isDone = !0, this.error = t, this.catchCallback && this.catchCallback(t);
    });
  }
  catch(e) {
    return this.next(void 0, e);
  }
  next(e, t) {
    return this.callbackAttached && x(), this.callbackAttached = !0, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new S((r, s) => {
      this.nextCallback = (o) => {
        this.wrapSuccess(e, o).next(r, s);
      }, this.catchCallback = (o) => {
        this.wrapFailure(t, o).next(r, s);
      };
    });
  }
  toPromise() {
    return new Promise((e, t) => {
      this.next(e, t);
    });
  }
  wrapUserFunction(e) {
    try {
      const t = e();
      return t instanceof S ? t : S.resolve(t);
    } catch (t) {
      return S.reject(t);
    }
  }
  wrapSuccess(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : S.resolve(t);
  }
  wrapFailure(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : S.reject(t);
  }
  static resolve(e) {
    return new S((t, r) => {
      t(e);
    });
  }
  static reject(e) {
    return new S((t, r) => {
      r(e);
    });
  }
  static waitFor(e) {
    return new S((t, r) => {
      let s = 0, o = 0, a = !1;
      e.forEach((u) => {
        ++s, u.next(() => {
          ++o, a && o === s && t();
        }, (l) => r(l));
      }), a = !0, o === s && t();
    });
  }
  /**
   * Given an array of predicate functions that asynchronously evaluate to a
   * boolean, implements a short-circuiting `or` between the results. Predicates
   * will be evaluated until one of them returns `true`, then stop. The final
   * result will be whether any of them returned `true`.
   */
  static or(e) {
    let t = S.resolve(!1);
    for (const r of e) t = t.next((s) => s ? S.resolve(s) : r());
    return t;
  }
  static forEach(e, t) {
    const r = [];
    return e.forEach((s, o) => {
      r.push(t.call(this, s, o));
    }), this.waitFor(r);
  }
  /**
   * Concurrently map all array elements through asynchronous function.
   */
  static mapArray(e, t) {
    return new S((r, s) => {
      const o = e.length, a = new Array(o);
      let u = 0;
      for (let l = 0; l < o; l++) {
        const d = l;
        t(e[d]).next((p) => {
          a[d] = p, ++u, u === o && r(a);
        }, (p) => s(p));
      }
    });
  }
  /**
   * An alternative to recursive PersistencePromise calls, that avoids
   * potential memory problems from unbounded chains of promises.
   *
   * The `action` will be called repeatedly while `condition` is true.
   */
  static doWhile(e, t) {
    return new S((r, s) => {
      const o = () => {
        e() === !0 ? t().next(() => {
          o();
        }, s) : r();
      };
      o();
    });
  }
}
function bg(n) {
  const e = n.match(/Android ([\d.]+)/i), t = e ? e[1].split(".").slice(0, 2).join(".") : "-1";
  return Number(t);
}
function gn(n) {
  return n.name === "IndexedDbTransactionError";
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ws {
  constructor(e, t) {
    this.previousValue = e, t && (t.sequenceNumberHandler = (r) => this.oe(r), this._e = (r) => t.writeSequenceNumber(r));
  }
  oe(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this._e && this._e(e), e;
  }
}
ws.ae = -1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const so = -1;
function As(n) {
  return n == null;
}
function ss(n) {
  return n === 0 && 1 / n == -1 / 0;
}
function kg(n) {
  return typeof n == "number" && Number.isInteger(n) && !ss(n) && n <= Number.MAX_SAFE_INTEGER && n >= Number.MIN_SAFE_INTEGER;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ml = "";
function Vg(n) {
  let e = "";
  for (let t = 0; t < n.length; t++) e.length > 0 && (e = Sc(e)), e = Dg(n.get(t), e);
  return Sc(e);
}
function Dg(n, e) {
  let t = e;
  const r = n.length;
  for (let s = 0; s < r; s++) {
    const o = n.charAt(s);
    switch (o) {
      case "\0":
        t += "";
        break;
      case ml:
        t += "";
        break;
      default:
        t += o;
    }
  }
  return t;
}
function Sc(n) {
  return n + ml + "";
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Pc(n) {
  let e = 0;
  for (const t in n) Object.prototype.hasOwnProperty.call(n, t) && e++;
  return e;
}
function At(n, e) {
  for (const t in n) Object.prototype.hasOwnProperty.call(n, t) && e(t, n[t]);
}
function gl(n) {
  for (const e in n) if (Object.prototype.hasOwnProperty.call(n, e)) return !1;
  return !0;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Y {
  constructor(e, t) {
    this.comparator = e, this.root = t || ue.EMPTY;
  }
  // Returns a copy of the map, with the specified key/value added or replaced.
  insert(e, t) {
    return new Y(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, ue.BLACK, null, null));
  }
  // Returns a copy of the map, with the specified key removed.
  remove(e) {
    return new Y(this.comparator, this.root.remove(e, this.comparator).copy(null, null, ue.BLACK, null, null));
  }
  // Returns the value of the node with the given key, or null.
  get(e) {
    let t = this.root;
    for (; !t.isEmpty(); ) {
      const r = this.comparator(e, t.key);
      if (r === 0) return t.value;
      r < 0 ? t = t.left : r > 0 && (t = t.right);
    }
    return null;
  }
  // Returns the index of the element in this sorted map, or -1 if it doesn't
  // exist.
  indexOf(e) {
    let t = 0, r = this.root;
    for (; !r.isEmpty(); ) {
      const s = this.comparator(e, r.key);
      if (s === 0) return t + r.left.size;
      s < 0 ? r = r.left : (
        // Count all nodes left of the node plus the node itself
        (t += r.left.size + 1, r = r.right)
      );
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  // Returns the total number of nodes in the map.
  get size() {
    return this.root.size;
  }
  // Returns the minimum key in the map.
  minKey() {
    return this.root.minKey();
  }
  // Returns the maximum key in the map.
  maxKey() {
    return this.root.maxKey();
  }
  // Traverses the map in key order and calls the specified action function
  // for each key/value pair. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t, r) => (e(t, r), !1));
  }
  toString() {
    const e = [];
    return this.inorderTraversal((t, r) => (e.push(`${t}:${r}`), !1)), `{${e.join(", ")}}`;
  }
  // Traverses the map in reverse key order and calls the specified action
  // function for each key/value pair. If action returns true, traversal is
  // aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  // Returns an iterator over the SortedMap.
  getIterator() {
    return new Or(this.root, null, this.comparator, !1);
  }
  getIteratorFrom(e) {
    return new Or(this.root, e, this.comparator, !1);
  }
  getReverseIterator() {
    return new Or(this.root, null, this.comparator, !0);
  }
  getReverseIteratorFrom(e) {
    return new Or(this.root, e, this.comparator, !0);
  }
}
class Or {
  constructor(e, t, r, s) {
    this.isReverse = s, this.nodeStack = [];
    let o = 1;
    for (; !e.isEmpty(); ) if (o = t ? r(e.key, t) : 1, // flip the comparison if we're going in reverse
    t && s && (o *= -1), o < 0)
      e = this.isReverse ? e.left : e.right;
    else {
      if (o === 0) {
        this.nodeStack.push(e);
        break;
      }
      this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
    }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse) for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), e = e.right;
    else for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), e = e.left;
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (this.nodeStack.length === 0) return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
}
class ue {
  constructor(e, t, r, s, o) {
    this.key = e, this.value = t, this.color = r ?? ue.RED, this.left = s ?? ue.EMPTY, this.right = o ?? ue.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  // Returns a copy of the current node, optionally replacing pieces of it.
  copy(e, t, r, s, o) {
    return new ue(e ?? this.key, t ?? this.value, r ?? this.color, s ?? this.left, o ?? this.right);
  }
  isEmpty() {
    return !1;
  }
  // Traverses the tree in key order and calls the specified action function
  // for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  // Traverses the tree in reverse key order and calls the specified action
  // function for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  // Returns the minimum node in the tree.
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  // Returns the maximum key in the tree.
  minKey() {
    return this.min().key;
  }
  // Returns the maximum key in the tree.
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  // Returns new tree, with the key/value added.
  insert(e, t, r) {
    let s = this;
    const o = r(e, s.key);
    return s = o < 0 ? s.copy(null, null, null, s.left.insert(e, t, r), null) : o === 0 ? s.copy(null, t, null, null, null) : s.copy(null, null, null, null, s.right.insert(e, t, r)), s.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty()) return ue.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  // Returns new tree, with the specified item removed.
  remove(e, t) {
    let r, s = this;
    if (t(e, s.key) < 0) s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(e, t), null);
    else {
      if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), t(e, s.key) === 0) {
        if (s.right.isEmpty()) return ue.EMPTY;
        r = s.right.min(), s = s.copy(r.key, r.value, null, null, s.right.removeMin());
      }
      s = s.copy(null, null, null, null, s.right.remove(e, t));
    }
    return s.fixUp();
  }
  isRed() {
    return this.color;
  }
  // Returns new tree after performing any needed rotations.
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, ue.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, ue.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  // For testing.
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  // In a balanced RB tree, the black-depth (number of black nodes) from root to
  // leaves is equal on both sides.  This function verifies that or asserts.
  check() {
    if (this.isRed() && this.left.isRed() || this.right.isRed()) throw x();
    const e = this.left.check();
    if (e !== this.right.check()) throw x();
    return e + (this.isRed() ? 0 : 1);
  }
}
ue.EMPTY = null, ue.RED = !0, ue.BLACK = !1;
ue.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
class {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw x();
  }
  get value() {
    throw x();
  }
  get color() {
    throw x();
  }
  get left() {
    throw x();
  }
  get right() {
    throw x();
  }
  // Returns a copy of the current node.
  copy(e, t, r, s, o) {
    return this;
  }
  // Returns a copy of the tree, with the specified key/value added.
  insert(e, t, r) {
    return new ue(e, t);
  }
  // Returns a copy of the tree, with the specified key removed.
  remove(e, t) {
    return this;
  }
  isEmpty() {
    return !0;
  }
  inorderTraversal(e) {
    return !1;
  }
  reverseTraversal(e) {
    return !1;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return !1;
  }
  // For testing.
  checkMaxDepth() {
    return !0;
  }
  check() {
    return 0;
  }
}();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class oe {
  constructor(e) {
    this.comparator = e, this.data = new Y(this.comparator);
  }
  has(e) {
    return this.data.get(e) !== null;
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  /** Iterates elements in order defined by "comparator" */
  forEach(e) {
    this.data.inorderTraversal((t, r) => (e(t), !1));
  }
  /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
  forEachInRange(e, t) {
    const r = this.data.getIteratorFrom(e[0]);
    for (; r.hasNext(); ) {
      const s = r.getNext();
      if (this.comparator(s.key, e[1]) >= 0) return;
      t(s.key);
    }
  }
  /**
   * Iterates over `elem`s such that: start &lt;= elem until false is returned.
   */
  forEachWhile(e, t) {
    let r;
    for (r = t !== void 0 ? this.data.getIteratorFrom(t) : this.data.getIterator(); r.hasNext(); )
      if (!e(r.getNext().key)) return;
  }
  /** Finds the least element greater than or equal to `elem`. */
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new Cc(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new Cc(this.data.getIteratorFrom(e));
  }
  /** Inserts or updates an element */
  add(e) {
    return this.copy(this.data.remove(e).insert(e, !0));
  }
  /** Deletes an element */
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return t.size < e.size && (t = e, e = this), e.forEach((r) => {
      t = t.add(r);
    }), t;
  }
  isEqual(e) {
    if (!(e instanceof oe) || this.size !== e.size) return !1;
    const t = this.data.getIterator(), r = e.data.getIterator();
    for (; t.hasNext(); ) {
      const s = t.getNext().key, o = r.getNext().key;
      if (this.comparator(s, o) !== 0) return !1;
    }
    return !0;
  }
  toArray() {
    const e = [];
    return this.forEach((t) => {
      e.push(t);
    }), e;
  }
  toString() {
    const e = [];
    return this.forEach((t) => e.push(t)), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t = new oe(this.comparator);
    return t.data = e, t;
  }
}
class Cc {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pe {
  constructor(e) {
    this.fields = e, // TODO(dimond): validation of FieldMask
    // Sort the field mask to support `FieldMask.isEqual()` and assert below.
    e.sort(le.comparator);
  }
  static empty() {
    return new Pe([]);
  }
  /**
   * Returns a new FieldMask object that is the result of adding all the given
   * fields paths to this field mask.
   */
  unionWith(e) {
    let t = new oe(le.comparator);
    for (const r of this.fields) t = t.add(r);
    for (const r of e) t = t.add(r);
    return new Pe(t.toArray());
  }
  /**
   * Verifies that `fieldPath` is included by at least one field in this field
   * mask.
   *
   * This is an O(n) operation, where `n` is the size of the field mask.
   */
  covers(e) {
    for (const t of this.fields) if (t.isPrefixOf(e)) return !0;
    return !1;
  }
  isEqual(e) {
    return rn(this.fields, e.fields, (t, r) => t.isEqual(r));
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class _l extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class de {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = function(s) {
      try {
        return atob(s);
      } catch (o) {
        throw typeof DOMException < "u" && o instanceof DOMException ? new _l("Invalid base64 string: " + o) : o;
      }
    }(e);
    return new de(t);
  }
  static fromUint8Array(e) {
    const t = (
      /**
      * Helper function to convert an Uint8array to a binary string.
      */
      function(s) {
        let o = "";
        for (let a = 0; a < s.length; ++a) o += String.fromCharCode(s[a]);
        return o;
      }(e)
    );
    return new de(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: !1
      } : {
        value: void 0,
        done: !0
      }
    };
  }
  toBase64() {
    return function(t) {
      return btoa(t);
    }(this.binaryString);
  }
  toUint8Array() {
    return function(t) {
      const r = new Uint8Array(t.length);
      for (let s = 0; s < t.length; s++) r[s] = t.charCodeAt(s);
      return r;
    }(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return B(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
}
de.EMPTY_BYTE_STRING = new de("");
const Ng = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function yt(n) {
  if (G(!!n), typeof n == "string") {
    let e = 0;
    const t = Ng.exec(n);
    if (G(!!t), t[1]) {
      let s = t[1];
      s = (s + "000000000").substr(0, 9), e = Number(s);
    }
    const r = new Date(n);
    return {
      seconds: Math.floor(r.getTime() / 1e3),
      nanos: e
    };
  }
  return {
    seconds: ne(n.seconds),
    nanos: ne(n.nanos)
  };
}
function ne(n) {
  return typeof n == "number" ? n : typeof n == "string" ? Number(n) : 0;
}
function vt(n) {
  return typeof n == "string" ? de.fromBase64String(n) : de.fromUint8Array(n);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const yl = "server_timestamp", vl = "__type__", El = "__previous_value__", Tl = "__local_write_time__";
function io(n) {
  var e, t;
  return ((t = (((e = n == null ? void 0 : n.mapValue) === null || e === void 0 ? void 0 : e.fields) || {})[vl]) === null || t === void 0 ? void 0 : t.stringValue) === yl;
}
function Rs(n) {
  const e = n.mapValue.fields[El];
  return io(e) ? Rs(e) : e;
}
function Yn(n) {
  const e = yt(n.mapValue.fields[Tl].timestampValue);
  return new ie(e.seconds, e.nanos);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Og {
  /**
   * Constructs a DatabaseInfo using the provided host, databaseId and
   * persistenceKey.
   *
   * @param databaseId - The database to use.
   * @param appId - The Firebase App Id.
   * @param persistenceKey - A unique identifier for this Firestore's local
   * storage (used in conjunction with the databaseId).
   * @param host - The Firestore backend host to connect to.
   * @param ssl - Whether to use SSL when connecting.
   * @param forceLongPolling - Whether to use the forceLongPolling option
   * when using WebChannel as the network transport.
   * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
   * option when using WebChannel as the network transport.
   * @param longPollingOptions Options that configure long-polling.
   * @param useFetchStreams Whether to use the Fetch API instead of
   * XMLHTTPRequest
   */
  constructor(e, t, r, s, o, a, u, l, d) {
    this.databaseId = e, this.appId = t, this.persistenceKey = r, this.host = s, this.ssl = o, this.forceLongPolling = a, this.autoDetectLongPolling = u, this.longPollingOptions = l, this.useFetchStreams = d;
  }
}
const is = "(default)";
class Zn {
  constructor(e, t) {
    this.projectId = e, this.database = t || is;
  }
  static empty() {
    return new Zn("", "");
  }
  get isDefaultDatabase() {
    return this.database === is;
  }
  isEqual(e) {
    return e instanceof Zn && e.projectId === this.projectId && e.database === this.database;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Il = "__type__", Lg = "__max__", Lr = {
  mapValue: {}
}, wl = "__vector__", os = "value";
function Et(n) {
  return "nullValue" in n ? 0 : "booleanValue" in n ? 1 : "integerValue" in n || "doubleValue" in n ? 2 : "timestampValue" in n ? 3 : "stringValue" in n ? 5 : "bytesValue" in n ? 6 : "referenceValue" in n ? 7 : "geoPointValue" in n ? 8 : "arrayValue" in n ? 9 : "mapValue" in n ? io(n) ? 4 : xg(n) ? 9007199254740991 : Mg(n) ? 10 : 11 : x();
}
function Be(n, e) {
  if (n === e) return !0;
  const t = Et(n);
  if (t !== Et(e)) return !1;
  switch (t) {
    case 0:
    case 9007199254740991:
      return !0;
    case 1:
      return n.booleanValue === e.booleanValue;
    case 4:
      return Yn(n).isEqual(Yn(e));
    case 3:
      return function(s, o) {
        if (typeof s.timestampValue == "string" && typeof o.timestampValue == "string" && s.timestampValue.length === o.timestampValue.length)
          return s.timestampValue === o.timestampValue;
        const a = yt(s.timestampValue), u = yt(o.timestampValue);
        return a.seconds === u.seconds && a.nanos === u.nanos;
      }(n, e);
    case 5:
      return n.stringValue === e.stringValue;
    case 6:
      return function(s, o) {
        return vt(s.bytesValue).isEqual(vt(o.bytesValue));
      }(n, e);
    case 7:
      return n.referenceValue === e.referenceValue;
    case 8:
      return function(s, o) {
        return ne(s.geoPointValue.latitude) === ne(o.geoPointValue.latitude) && ne(s.geoPointValue.longitude) === ne(o.geoPointValue.longitude);
      }(n, e);
    case 2:
      return function(s, o) {
        if ("integerValue" in s && "integerValue" in o) return ne(s.integerValue) === ne(o.integerValue);
        if ("doubleValue" in s && "doubleValue" in o) {
          const a = ne(s.doubleValue), u = ne(o.doubleValue);
          return a === u ? ss(a) === ss(u) : isNaN(a) && isNaN(u);
        }
        return !1;
      }(n, e);
    case 9:
      return rn(n.arrayValue.values || [], e.arrayValue.values || [], Be);
    case 10:
    case 11:
      return function(s, o) {
        const a = s.mapValue.fields || {}, u = o.mapValue.fields || {};
        if (Pc(a) !== Pc(u)) return !1;
        for (const l in a) if (a.hasOwnProperty(l) && (u[l] === void 0 || !Be(a[l], u[l]))) return !1;
        return !0;
      }(n, e);
    default:
      return x();
  }
}
function er(n, e) {
  return (n.values || []).find((t) => Be(t, e)) !== void 0;
}
function sn(n, e) {
  if (n === e) return 0;
  const t = Et(n), r = Et(e);
  if (t !== r) return B(t, r);
  switch (t) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return B(n.booleanValue, e.booleanValue);
    case 2:
      return function(o, a) {
        const u = ne(o.integerValue || o.doubleValue), l = ne(a.integerValue || a.doubleValue);
        return u < l ? -1 : u > l ? 1 : u === l ? 0 : (
          // one or both are NaN.
          isNaN(u) ? isNaN(l) ? 0 : -1 : 1
        );
      }(n, e);
    case 3:
      return bc(n.timestampValue, e.timestampValue);
    case 4:
      return bc(Yn(n), Yn(e));
    case 5:
      return bi(n.stringValue, e.stringValue);
    case 6:
      return function(o, a) {
        const u = vt(o), l = vt(a);
        return u.compareTo(l);
      }(n.bytesValue, e.bytesValue);
    case 7:
      return function(o, a) {
        const u = o.split("/"), l = a.split("/");
        for (let d = 0; d < u.length && d < l.length; d++) {
          const p = B(u[d], l[d]);
          if (p !== 0) return p;
        }
        return B(u.length, l.length);
      }(n.referenceValue, e.referenceValue);
    case 8:
      return function(o, a) {
        const u = B(ne(o.latitude), ne(a.latitude));
        return u !== 0 ? u : B(ne(o.longitude), ne(a.longitude));
      }(n.geoPointValue, e.geoPointValue);
    case 9:
      return kc(n.arrayValue, e.arrayValue);
    case 10:
      return function(o, a) {
        var u, l, d, p;
        const y = o.fields || {}, w = a.fields || {}, P = (u = y[os]) === null || u === void 0 ? void 0 : u.arrayValue, k = (l = w[os]) === null || l === void 0 ? void 0 : l.arrayValue, N = B(((d = P == null ? void 0 : P.values) === null || d === void 0 ? void 0 : d.length) || 0, ((p = k == null ? void 0 : k.values) === null || p === void 0 ? void 0 : p.length) || 0);
        return N !== 0 ? N : kc(P, k);
      }(n.mapValue, e.mapValue);
    case 11:
      return function(o, a) {
        if (o === Lr.mapValue && a === Lr.mapValue) return 0;
        if (o === Lr.mapValue) return 1;
        if (a === Lr.mapValue) return -1;
        const u = o.fields || {}, l = Object.keys(u), d = a.fields || {}, p = Object.keys(d);
        l.sort(), p.sort();
        for (let y = 0; y < l.length && y < p.length; ++y) {
          const w = bi(l[y], p[y]);
          if (w !== 0) return w;
          const P = sn(u[l[y]], d[p[y]]);
          if (P !== 0) return P;
        }
        return B(l.length, p.length);
      }(n.mapValue, e.mapValue);
    default:
      throw x();
  }
}
function bc(n, e) {
  if (typeof n == "string" && typeof e == "string" && n.length === e.length) return B(n, e);
  const t = yt(n), r = yt(e), s = B(t.seconds, r.seconds);
  return s !== 0 ? s : B(t.nanos, r.nanos);
}
function kc(n, e) {
  const t = n.values || [], r = e.values || [];
  for (let s = 0; s < t.length && s < r.length; ++s) {
    const o = sn(t[s], r[s]);
    if (o) return o;
  }
  return B(t.length, r.length);
}
function on(n) {
  return ki(n);
}
function ki(n) {
  return "nullValue" in n ? "null" : "booleanValue" in n ? "" + n.booleanValue : "integerValue" in n ? "" + n.integerValue : "doubleValue" in n ? "" + n.doubleValue : "timestampValue" in n ? function(t) {
    const r = yt(t);
    return `time(${r.seconds},${r.nanos})`;
  }(n.timestampValue) : "stringValue" in n ? n.stringValue : "bytesValue" in n ? function(t) {
    return vt(t).toBase64();
  }(n.bytesValue) : "referenceValue" in n ? function(t) {
    return L.fromName(t).toString();
  }(n.referenceValue) : "geoPointValue" in n ? function(t) {
    return `geo(${t.latitude},${t.longitude})`;
  }(n.geoPointValue) : "arrayValue" in n ? function(t) {
    let r = "[", s = !0;
    for (const o of t.values || []) s ? s = !1 : r += ",", r += ki(o);
    return r + "]";
  }(n.arrayValue) : "mapValue" in n ? function(t) {
    const r = Object.keys(t.fields || {}).sort();
    let s = "{", o = !0;
    for (const a of r) o ? o = !1 : s += ",", s += `${a}:${ki(t.fields[a])}`;
    return s + "}";
  }(n.mapValue) : x();
}
function Hr(n) {
  switch (Et(n)) {
    case 0:
    case 1:
      return 4;
    case 2:
      return 8;
    case 3:
    case 8:
      return 16;
    case 4:
      const e = Rs(n);
      return e ? 16 + Hr(e) : 16;
    case 5:
      return 2 * n.stringValue.length;
    case 6:
      return vt(n.bytesValue).approximateByteSize();
    case 7:
      return n.referenceValue.length;
    case 9:
      return function(r) {
        return (r.values || []).reduce((s, o) => s + Hr(o), 0);
      }(n.arrayValue);
    case 10:
    case 11:
      return function(r) {
        let s = 0;
        return At(r.fields, (o, a) => {
          s += o.length + Hr(a);
        }), s;
      }(n.mapValue);
    default:
      throw x();
  }
}
function Vi(n) {
  return !!n && "integerValue" in n;
}
function oo(n) {
  return !!n && "arrayValue" in n;
}
function Vc(n) {
  return !!n && "nullValue" in n;
}
function Dc(n) {
  return !!n && "doubleValue" in n && isNaN(Number(n.doubleValue));
}
function Wr(n) {
  return !!n && "mapValue" in n;
}
function Mg(n) {
  var e, t;
  return ((t = (((e = n == null ? void 0 : n.mapValue) === null || e === void 0 ? void 0 : e.fields) || {})[Il]) === null || t === void 0 ? void 0 : t.stringValue) === wl;
}
function $n(n) {
  if (n.geoPointValue) return {
    geoPointValue: Object.assign({}, n.geoPointValue)
  };
  if (n.timestampValue && typeof n.timestampValue == "object") return {
    timestampValue: Object.assign({}, n.timestampValue)
  };
  if (n.mapValue) {
    const e = {
      mapValue: {
        fields: {}
      }
    };
    return At(n.mapValue.fields, (t, r) => e.mapValue.fields[t] = $n(r)), e;
  }
  if (n.arrayValue) {
    const e = {
      arrayValue: {
        values: []
      }
    };
    for (let t = 0; t < (n.arrayValue.values || []).length; ++t) e.arrayValue.values[t] = $n(n.arrayValue.values[t]);
    return e;
  }
  return Object.assign({}, n);
}
function xg(n) {
  return (((n.mapValue || {}).fields || {}).__type__ || {}).stringValue === Lg;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ae {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new Ae({
      mapValue: {}
    });
  }
  /**
   * Returns the value at the given path or null.
   *
   * @param path - the path to search
   * @returns The value at the path or null if the path is not set.
   */
  field(e) {
    if (e.isEmpty()) return this.value;
    {
      let t = this.value;
      for (let r = 0; r < e.length - 1; ++r) if (t = (t.mapValue.fields || {})[e.get(r)], !Wr(t)) return null;
      return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
    }
  }
  /**
   * Sets the field to the provided value.
   *
   * @param path - The field path to set.
   * @param value - The value to set.
   */
  set(e, t) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = $n(t);
  }
  /**
   * Sets the provided fields to the provided values.
   *
   * @param data - A map of fields to values (or null for deletes).
   */
  setAll(e) {
    let t = le.emptyPath(), r = {}, s = [];
    e.forEach((a, u) => {
      if (!t.isImmediateParentOf(u)) {
        const l = this.getFieldsMap(t);
        this.applyChanges(l, r, s), r = {}, s = [], t = u.popLast();
      }
      a ? r[u.lastSegment()] = $n(a) : s.push(u.lastSegment());
    });
    const o = this.getFieldsMap(t);
    this.applyChanges(o, r, s);
  }
  /**
   * Removes the field at the specified path. If there is no field at the
   * specified path, nothing is changed.
   *
   * @param path - The field path to remove.
   */
  delete(e) {
    const t = this.field(e.popLast());
    Wr(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return Be(this.value, e.value);
  }
  /**
   * Returns the map that contains the leaf element of `path`. If the parent
   * entry does not yet exist, or if it is not a map, a new map will be created.
   */
  getFieldsMap(e) {
    let t = this.value;
    t.mapValue.fields || (t.mapValue = {
      fields: {}
    });
    for (let r = 0; r < e.length; ++r) {
      let s = t.mapValue.fields[e.get(r)];
      Wr(s) && s.mapValue.fields || (s = {
        mapValue: {
          fields: {}
        }
      }, t.mapValue.fields[e.get(r)] = s), t = s;
    }
    return t.mapValue.fields;
  }
  /**
   * Modifies `fieldsMap` by adding, replacing or deleting the specified
   * entries.
   */
  applyChanges(e, t, r) {
    At(t, (s, o) => e[s] = o);
    for (const s of r) delete e[s];
  }
  clone() {
    return new Ae($n(this.value));
  }
}
function Al(n) {
  const e = [];
  return At(n.fields, (t, r) => {
    const s = new le([t]);
    if (Wr(r)) {
      const o = Al(r.mapValue).fields;
      if (o.length === 0)
        e.push(s);
      else
        for (const a of o) e.push(s.child(a));
    } else
      e.push(s);
  }), new Pe(e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ve {
  constructor(e, t, r, s, o, a, u) {
    this.key = e, this.documentType = t, this.version = r, this.readTime = s, this.createTime = o, this.data = a, this.documentState = u;
  }
  /**
   * Creates a document with no known version or data, but which can serve as
   * base document for mutations.
   */
  static newInvalidDocument(e) {
    return new ve(
      e,
      0,
      /* version */
      U.min(),
      /* readTime */
      U.min(),
      /* createTime */
      U.min(),
      Ae.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist with the given data at the
   * given version.
   */
  static newFoundDocument(e, t, r, s) {
    return new ve(
      e,
      1,
      /* version */
      t,
      /* readTime */
      U.min(),
      /* createTime */
      r,
      s,
      0
      /* DocumentState.SYNCED */
    );
  }
  /** Creates a new document that is known to not exist at the given version. */
  static newNoDocument(e, t) {
    return new ve(
      e,
      2,
      /* version */
      t,
      /* readTime */
      U.min(),
      /* createTime */
      U.min(),
      Ae.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist at the given version but
   * whose data is not known (e.g. a document that was updated without a known
   * base document).
   */
  static newUnknownDocument(e, t) {
    return new ve(
      e,
      3,
      /* version */
      t,
      /* readTime */
      U.min(),
      /* createTime */
      U.min(),
      Ae.empty(),
      2
      /* DocumentState.HAS_COMMITTED_MUTATIONS */
    );
  }
  /**
   * Changes the document type to indicate that it exists and that its version
   * and data are known.
   */
  convertToFoundDocument(e, t) {
    return !this.createTime.isEqual(U.min()) || this.documentType !== 2 && this.documentType !== 0 || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it doesn't exist at the given
   * version.
   */
  convertToNoDocument(e) {
    return this.version = e, this.documentType = 2, this.data = Ae.empty(), this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it exists at a given version but
   * that its data is not known (e.g. a document that was updated without a known
   * base document).
   */
  convertToUnknownDocument(e) {
    return this.version = e, this.documentType = 3, this.data = Ae.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = U.min(), this;
  }
  setReadTime(e) {
    return this.readTime = e, this;
  }
  get hasLocalMutations() {
    return this.documentState === 1;
  }
  get hasCommittedMutations() {
    return this.documentState === 2;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return this.documentType !== 0;
  }
  isFoundDocument() {
    return this.documentType === 1;
  }
  isNoDocument() {
    return this.documentType === 2;
  }
  isUnknownDocument() {
    return this.documentType === 3;
  }
  isEqual(e) {
    return e instanceof ve && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
  }
  mutableCopy() {
    return new ve(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class as {
  constructor(e, t) {
    this.position = e, this.inclusive = t;
  }
}
function Nc(n, e, t) {
  let r = 0;
  for (let s = 0; s < n.position.length; s++) {
    const o = e[s], a = n.position[s];
    if (o.field.isKeyField() ? r = L.comparator(L.fromName(a.referenceValue), t.key) : r = sn(a, t.data.field(o.field)), o.dir === "desc" && (r *= -1), r !== 0) break;
  }
  return r;
}
function Oc(n, e) {
  if (n === null) return e === null;
  if (e === null || n.inclusive !== e.inclusive || n.position.length !== e.position.length) return !1;
  for (let t = 0; t < n.position.length; t++)
    if (!Be(n.position[t], e.position[t])) return !1;
  return !0;
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class cs {
  constructor(e, t = "asc") {
    this.field = e, this.dir = t;
  }
}
function Ug(n, e) {
  return n.dir === e.dir && n.field.isEqual(e.field);
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Rl {
}
class se extends Rl {
  constructor(e, t, r) {
    super(), this.field = e, this.op = t, this.value = r;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t, r) {
    return e.isKeyField() ? t === "in" || t === "not-in" ? this.createKeyFieldInFilter(e, t, r) : new Bg(e, t, r) : t === "array-contains" ? new $g(e, r) : t === "in" ? new zg(e, r) : t === "not-in" ? new Hg(e, r) : t === "array-contains-any" ? new Wg(e, r) : new se(e, t, r);
  }
  static createKeyFieldInFilter(e, t, r) {
    return t === "in" ? new jg(e, r) : new qg(e, r);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return this.op === "!=" ? t !== null && this.matchesComparison(sn(t, this.value)) : t !== null && Et(this.value) === Et(t) && this.matchesComparison(sn(t, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case "<":
        return e < 0;
      case "<=":
        return e <= 0;
      case "==":
        return e === 0;
      case "!=":
        return e !== 0;
      case ">":
        return e > 0;
      case ">=":
        return e >= 0;
      default:
        return x();
    }
  }
  isInequality() {
    return [
      "<",
      "<=",
      ">",
      ">=",
      "!=",
      "not-in"
      /* Operator.NOT_IN */
    ].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
}
class je extends Rl {
  constructor(e, t) {
    super(), this.filters = e, this.op = t, this.ce = null;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t) {
    return new je(e, t);
  }
  matches(e) {
    return Sl(this) ? this.filters.find((t) => !t.matches(e)) === void 0 : this.filters.find((t) => t.matches(e)) !== void 0;
  }
  getFlattenedFilters() {
    return this.ce !== null || (this.ce = this.filters.reduce((e, t) => e.concat(t.getFlattenedFilters()), [])), this.ce;
  }
  // Returns a mutable copy of `this.filters`
  getFilters() {
    return Object.assign([], this.filters);
  }
}
function Sl(n) {
  return n.op === "and";
}
function Pl(n) {
  return Fg(n) && Sl(n);
}
function Fg(n) {
  for (const e of n.filters) if (e instanceof je) return !1;
  return !0;
}
function Di(n) {
  if (n instanceof se)
    return n.field.canonicalString() + n.op.toString() + on(n.value);
  if (Pl(n))
    return n.filters.map((e) => Di(e)).join(",");
  {
    const e = n.filters.map((t) => Di(t)).join(",");
    return `${n.op}(${e})`;
  }
}
function Cl(n, e) {
  return n instanceof se ? function(r, s) {
    return s instanceof se && r.op === s.op && r.field.isEqual(s.field) && Be(r.value, s.value);
  }(n, e) : n instanceof je ? function(r, s) {
    return s instanceof je && r.op === s.op && r.filters.length === s.filters.length ? r.filters.reduce((o, a, u) => o && Cl(a, s.filters[u]), !0) : !1;
  }(n, e) : void x();
}
function bl(n) {
  return n instanceof se ? function(t) {
    return `${t.field.canonicalString()} ${t.op} ${on(t.value)}`;
  }(n) : n instanceof je ? function(t) {
    return t.op.toString() + " {" + t.getFilters().map(bl).join(" ,") + "}";
  }(n) : "Filter";
}
class Bg extends se {
  constructor(e, t, r) {
    super(e, t, r), this.key = L.fromName(r.referenceValue);
  }
  matches(e) {
    const t = L.comparator(e.key, this.key);
    return this.matchesComparison(t);
  }
}
class jg extends se {
  constructor(e, t) {
    super(e, "in", t), this.keys = kl("in", t);
  }
  matches(e) {
    return this.keys.some((t) => t.isEqual(e.key));
  }
}
class qg extends se {
  constructor(e, t) {
    super(e, "not-in", t), this.keys = kl("not-in", t);
  }
  matches(e) {
    return !this.keys.some((t) => t.isEqual(e.key));
  }
}
function kl(n, e) {
  var t;
  return (((t = e.arrayValue) === null || t === void 0 ? void 0 : t.values) || []).map((r) => L.fromName(r.referenceValue));
}
class $g extends se {
  constructor(e, t) {
    super(e, "array-contains", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return oo(t) && er(t.arrayValue, this.value);
  }
}
class zg extends se {
  constructor(e, t) {
    super(e, "in", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return t !== null && er(this.value.arrayValue, t);
  }
}
class Hg extends se {
  constructor(e, t) {
    super(e, "not-in", t);
  }
  matches(e) {
    if (er(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    })) return !1;
    const t = e.data.field(this.field);
    return t !== null && !er(this.value.arrayValue, t);
  }
}
class Wg extends se {
  constructor(e, t) {
    super(e, "array-contains-any", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return !(!oo(t) || !t.arrayValue.values) && t.arrayValue.values.some((r) => er(this.value.arrayValue, r));
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Kg {
  constructor(e, t = null, r = [], s = [], o = null, a = null, u = null) {
    this.path = e, this.collectionGroup = t, this.orderBy = r, this.filters = s, this.limit = o, this.startAt = a, this.endAt = u, this.le = null;
  }
}
function Lc(n, e = null, t = [], r = [], s = null, o = null, a = null) {
  return new Kg(n, e, t, r, s, o, a);
}
function ao(n) {
  const e = F(n);
  if (e.le === null) {
    let t = e.path.canonicalString();
    e.collectionGroup !== null && (t += "|cg:" + e.collectionGroup), t += "|f:", t += e.filters.map((r) => Di(r)).join(","), t += "|ob:", t += e.orderBy.map((r) => function(o) {
      return o.field.canonicalString() + o.dir;
    }(r)).join(","), As(e.limit) || (t += "|l:", t += e.limit), e.startAt && (t += "|lb:", t += e.startAt.inclusive ? "b:" : "a:", t += e.startAt.position.map((r) => on(r)).join(",")), e.endAt && (t += "|ub:", t += e.endAt.inclusive ? "a:" : "b:", t += e.endAt.position.map((r) => on(r)).join(",")), e.le = t;
  }
  return e.le;
}
function co(n, e) {
  if (n.limit !== e.limit || n.orderBy.length !== e.orderBy.length) return !1;
  for (let t = 0; t < n.orderBy.length; t++) if (!Ug(n.orderBy[t], e.orderBy[t])) return !1;
  if (n.filters.length !== e.filters.length) return !1;
  for (let t = 0; t < n.filters.length; t++) if (!Cl(n.filters[t], e.filters[t])) return !1;
  return n.collectionGroup === e.collectionGroup && !!n.path.isEqual(e.path) && !!Oc(n.startAt, e.startAt) && Oc(n.endAt, e.endAt);
}
function Ni(n) {
  return L.isDocumentKey(n.path) && n.collectionGroup === null && n.filters.length === 0;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ss {
  /**
   * Initializes a Query with a path and optional additional query constraints.
   * Path must currently be empty if this is a collection group query.
   */
  constructor(e, t = null, r = [], s = [], o = null, a = "F", u = null, l = null) {
    this.path = e, this.collectionGroup = t, this.explicitOrderBy = r, this.filters = s, this.limit = o, this.limitType = a, this.startAt = u, this.endAt = l, this.he = null, // The corresponding `Target` of this `Query` instance, for use with
    // non-aggregate queries.
    this.Pe = null, // The corresponding `Target` of this `Query` instance, for use with
    // aggregate queries. Unlike targets for non-aggregate queries,
    // aggregate query targets do not contain normalized order-bys, they only
    // contain explicit order-bys.
    this.Te = null, this.startAt, this.endAt;
  }
}
function Gg(n, e, t, r, s, o, a, u) {
  return new Ss(n, e, t, r, s, o, a, u);
}
function uo(n) {
  return new Ss(n);
}
function Mc(n) {
  return n.filters.length === 0 && n.limit === null && n.startAt == null && n.endAt == null && (n.explicitOrderBy.length === 0 || n.explicitOrderBy.length === 1 && n.explicitOrderBy[0].field.isKeyField());
}
function Qg(n) {
  return n.collectionGroup !== null;
}
function zn(n) {
  const e = F(n);
  if (e.he === null) {
    e.he = [];
    const t = /* @__PURE__ */ new Set();
    for (const o of e.explicitOrderBy) e.he.push(o), t.add(o.field.canonicalString());
    const r = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
    (function(a) {
      let u = new oe(le.comparator);
      return a.filters.forEach((l) => {
        l.getFlattenedFilters().forEach((d) => {
          d.isInequality() && (u = u.add(d.field));
        });
      }), u;
    })(e).forEach((o) => {
      t.has(o.canonicalString()) || o.isKeyField() || e.he.push(new cs(o, r));
    }), // Add the document key field to the last if it is not explicitly ordered.
    t.has(le.keyField().canonicalString()) || e.he.push(new cs(le.keyField(), r));
  }
  return e.he;
}
function Ue(n) {
  const e = F(n);
  return e.Pe || (e.Pe = Jg(e, zn(n))), e.Pe;
}
function Jg(n, e) {
  if (n.limitType === "F") return Lc(n.path, n.collectionGroup, e, n.filters, n.limit, n.startAt, n.endAt);
  {
    e = e.map((s) => {
      const o = s.dir === "desc" ? "asc" : "desc";
      return new cs(s.field, o);
    });
    const t = n.endAt ? new as(n.endAt.position, n.endAt.inclusive) : null, r = n.startAt ? new as(n.startAt.position, n.startAt.inclusive) : null;
    return Lc(n.path, n.collectionGroup, e, n.filters, n.limit, t, r);
  }
}
function Oi(n, e, t) {
  return new Ss(n.path, n.collectionGroup, n.explicitOrderBy.slice(), n.filters.slice(), e, t, n.startAt, n.endAt);
}
function Ps(n, e) {
  return co(Ue(n), Ue(e)) && n.limitType === e.limitType;
}
function Vl(n) {
  return `${ao(Ue(n))}|lt:${n.limitType}`;
}
function Wt(n) {
  return `Query(target=${function(t) {
    let r = t.path.canonicalString();
    return t.collectionGroup !== null && (r += " collectionGroup=" + t.collectionGroup), t.filters.length > 0 && (r += `, filters: [${t.filters.map((s) => bl(s)).join(", ")}]`), As(t.limit) || (r += ", limit: " + t.limit), t.orderBy.length > 0 && (r += `, orderBy: [${t.orderBy.map((s) => function(a) {
      return `${a.field.canonicalString()} (${a.dir})`;
    }(s)).join(", ")}]`), t.startAt && (r += ", startAt: ", r += t.startAt.inclusive ? "b:" : "a:", r += t.startAt.position.map((s) => on(s)).join(",")), t.endAt && (r += ", endAt: ", r += t.endAt.inclusive ? "a:" : "b:", r += t.endAt.position.map((s) => on(s)).join(",")), `Target(${r})`;
  }(Ue(n))}; limitType=${n.limitType})`;
}
function Cs(n, e) {
  return e.isFoundDocument() && function(r, s) {
    const o = s.key.path;
    return r.collectionGroup !== null ? s.key.hasCollectionId(r.collectionGroup) && r.path.isPrefixOf(o) : L.isDocumentKey(r.path) ? r.path.isEqual(o) : r.path.isImmediateParentOf(o);
  }(n, e) && function(r, s) {
    for (const o of zn(r))
      if (!o.field.isKeyField() && s.data.field(o.field) === null) return !1;
    return !0;
  }(n, e) && function(r, s) {
    for (const o of r.filters) if (!o.matches(s)) return !1;
    return !0;
  }(n, e) && function(r, s) {
    return !(r.startAt && !/**
    * Returns true if a document sorts before a bound using the provided sort
    * order.
    */
    function(a, u, l) {
      const d = Nc(a, u, l);
      return a.inclusive ? d <= 0 : d < 0;
    }(r.startAt, zn(r), s) || r.endAt && !function(a, u, l) {
      const d = Nc(a, u, l);
      return a.inclusive ? d >= 0 : d > 0;
    }(r.endAt, zn(r), s));
  }(n, e);
}
function Xg(n) {
  return n.collectionGroup || (n.path.length % 2 == 1 ? n.path.lastSegment() : n.path.get(n.path.length - 2));
}
function Dl(n) {
  return (e, t) => {
    let r = !1;
    for (const s of zn(n)) {
      const o = Yg(s, e, t);
      if (o !== 0) return o;
      r = r || s.field.isKeyField();
    }
    return 0;
  };
}
function Yg(n, e, t) {
  const r = n.field.isKeyField() ? L.comparator(e.key, t.key) : function(o, a, u) {
    const l = a.data.field(o), d = u.data.field(o);
    return l !== null && d !== null ? sn(l, d) : x();
  }(n.field, e, t);
  switch (n.dir) {
    case "asc":
      return r;
    case "desc":
      return -1 * r;
    default:
      return x();
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ft {
  constructor(e, t) {
    this.mapKeyFn = e, this.equalsFn = t, /**
     * The inner map for a key/value pair. Due to the possibility of collisions we
     * keep a list of entries that we do a linear search through to find an actual
     * match. Note that collisions should be rare, so we still expect near
     * constant time lookups in practice.
     */
    this.inner = {}, /** The number of entries stored in the map */
    this.innerSize = 0;
  }
  /** Get a value for this key, or undefined if it does not exist. */
  get(e) {
    const t = this.mapKeyFn(e), r = this.inner[t];
    if (r !== void 0) {
      for (const [s, o] of r) if (this.equalsFn(s, e)) return o;
    }
  }
  has(e) {
    return this.get(e) !== void 0;
  }
  /** Put this key and value in the map. */
  set(e, t) {
    const r = this.mapKeyFn(e), s = this.inner[r];
    if (s === void 0) return this.inner[r] = [[e, t]], void this.innerSize++;
    for (let o = 0; o < s.length; o++) if (this.equalsFn(s[o][0], e))
      return void (s[o] = [e, t]);
    s.push([e, t]), this.innerSize++;
  }
  /**
   * Remove this key from the map. Returns a boolean if anything was deleted.
   */
  delete(e) {
    const t = this.mapKeyFn(e), r = this.inner[t];
    if (r === void 0) return !1;
    for (let s = 0; s < r.length; s++) if (this.equalsFn(r[s][0], e)) return r.length === 1 ? delete this.inner[t] : r.splice(s, 1), this.innerSize--, !0;
    return !1;
  }
  forEach(e) {
    At(this.inner, (t, r) => {
      for (const [s, o] of r) e(s, o);
    });
  }
  isEmpty() {
    return gl(this.inner);
  }
  size() {
    return this.innerSize;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Zg = new Y(L.comparator);
function Ze() {
  return Zg;
}
const Nl = new Y(L.comparator);
function Fn(...n) {
  let e = Nl;
  for (const t of n) e = e.insert(t.key, t);
  return e;
}
function Ol(n) {
  let e = Nl;
  return n.forEach((t, r) => e = e.insert(t, r.overlayedDocument)), e;
}
function Dt() {
  return Hn();
}
function Ll() {
  return Hn();
}
function Hn() {
  return new Ft((n) => n.toString(), (n, e) => n.isEqual(e));
}
const e_ = new Y(L.comparator), t_ = new oe(L.comparator);
function q(...n) {
  let e = t_;
  for (const t of n) e = e.add(t);
  return e;
}
const n_ = new oe(B);
function r_() {
  return n_;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function lo(n, e) {
  if (n.useProto3Json) {
    if (isNaN(e)) return {
      doubleValue: "NaN"
    };
    if (e === 1 / 0) return {
      doubleValue: "Infinity"
    };
    if (e === -1 / 0) return {
      doubleValue: "-Infinity"
    };
  }
  return {
    doubleValue: ss(e) ? "-0" : e
  };
}
function Ml(n) {
  return {
    integerValue: "" + n
  };
}
function s_(n, e) {
  return kg(e) ? Ml(e) : lo(n, e);
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class bs {
  constructor() {
    this._ = void 0;
  }
}
function i_(n, e, t) {
  return n instanceof us ? function(s, o) {
    const a = {
      fields: {
        [vl]: {
          stringValue: yl
        },
        [Tl]: {
          timestampValue: {
            seconds: s.seconds,
            nanos: s.nanoseconds
          }
        }
      }
    };
    return o && io(o) && (o = Rs(o)), o && (a.fields[El] = o), {
      mapValue: a
    };
  }(t, e) : n instanceof tr ? Ul(n, e) : n instanceof nr ? Fl(n, e) : function(s, o) {
    const a = xl(s, o), u = xc(a) + xc(s.Ie);
    return Vi(a) && Vi(s.Ie) ? Ml(u) : lo(s.serializer, u);
  }(n, e);
}
function o_(n, e, t) {
  return n instanceof tr ? Ul(n, e) : n instanceof nr ? Fl(n, e) : t;
}
function xl(n, e) {
  return n instanceof ls ? (
    /** Returns true if `value` is either an IntegerValue or a DoubleValue. */
    function(r) {
      return Vi(r) || function(o) {
        return !!o && "doubleValue" in o;
      }(r);
    }(e) ? e : {
      integerValue: 0
    }
  ) : null;
}
class us extends bs {
}
class tr extends bs {
  constructor(e) {
    super(), this.elements = e;
  }
}
function Ul(n, e) {
  const t = Bl(e);
  for (const r of n.elements) t.some((s) => Be(s, r)) || t.push(r);
  return {
    arrayValue: {
      values: t
    }
  };
}
class nr extends bs {
  constructor(e) {
    super(), this.elements = e;
  }
}
function Fl(n, e) {
  let t = Bl(e);
  for (const r of n.elements) t = t.filter((s) => !Be(s, r));
  return {
    arrayValue: {
      values: t
    }
  };
}
class ls extends bs {
  constructor(e, t) {
    super(), this.serializer = e, this.Ie = t;
  }
}
function xc(n) {
  return ne(n.integerValue || n.doubleValue);
}
function Bl(n) {
  return oo(n) && n.arrayValue.values ? n.arrayValue.values.slice() : [];
}
function a_(n, e) {
  return n.field.isEqual(e.field) && function(r, s) {
    return r instanceof tr && s instanceof tr || r instanceof nr && s instanceof nr ? rn(r.elements, s.elements, Be) : r instanceof ls && s instanceof ls ? Be(r.Ie, s.Ie) : r instanceof us && s instanceof us;
  }(n.transform, e.transform);
}
class c_ {
  constructor(e, t) {
    this.version = e, this.transformResults = t;
  }
}
class De {
  constructor(e, t) {
    this.updateTime = e, this.exists = t;
  }
  /** Creates a new empty Precondition. */
  static none() {
    return new De();
  }
  /** Creates a new Precondition with an exists flag. */
  static exists(e) {
    return new De(void 0, e);
  }
  /** Creates a new Precondition based on a version a document exists at. */
  static updateTime(e) {
    return new De(e);
  }
  /** Returns whether this Precondition is empty. */
  get isNone() {
    return this.updateTime === void 0 && this.exists === void 0;
  }
  isEqual(e) {
    return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
  }
}
function Kr(n, e) {
  return n.updateTime !== void 0 ? e.isFoundDocument() && e.version.isEqual(n.updateTime) : n.exists === void 0 || n.exists === e.isFoundDocument();
}
class ks {
}
function jl(n, e) {
  if (!n.hasLocalMutations || e && e.fields.length === 0) return null;
  if (e === null) return n.isNoDocument() ? new ho(n.key, De.none()) : new ur(n.key, n.data, De.none());
  {
    const t = n.data, r = Ae.empty();
    let s = new oe(le.comparator);
    for (let o of e.fields) if (!s.has(o)) {
      let a = t.field(o);
      a === null && o.length > 1 && (o = o.popLast(), a = t.field(o)), a === null ? r.delete(o) : r.set(o, a), s = s.add(o);
    }
    return new Rt(n.key, r, new Pe(s.toArray()), De.none());
  }
}
function u_(n, e, t) {
  n instanceof ur ? function(s, o, a) {
    const u = s.value.clone(), l = Fc(s.fieldTransforms, o, a.transformResults);
    u.setAll(l), o.convertToFoundDocument(a.version, u).setHasCommittedMutations();
  }(n, e, t) : n instanceof Rt ? function(s, o, a) {
    if (!Kr(s.precondition, o))
      return void o.convertToUnknownDocument(a.version);
    const u = Fc(s.fieldTransforms, o, a.transformResults), l = o.data;
    l.setAll(ql(s)), l.setAll(u), o.convertToFoundDocument(a.version, l).setHasCommittedMutations();
  }(n, e, t) : function(s, o, a) {
    o.convertToNoDocument(a.version).setHasCommittedMutations();
  }(0, e, t);
}
function Wn(n, e, t, r) {
  return n instanceof ur ? function(o, a, u, l) {
    if (!Kr(o.precondition, a))
      return u;
    const d = o.value.clone(), p = Bc(o.fieldTransforms, l, a);
    return d.setAll(p), a.convertToFoundDocument(a.version, d).setHasLocalMutations(), null;
  }(n, e, t, r) : n instanceof Rt ? function(o, a, u, l) {
    if (!Kr(o.precondition, a)) return u;
    const d = Bc(o.fieldTransforms, l, a), p = a.data;
    return p.setAll(ql(o)), p.setAll(d), a.convertToFoundDocument(a.version, p).setHasLocalMutations(), u === null ? null : u.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((y) => y.field));
  }(n, e, t, r) : function(o, a, u) {
    return Kr(o.precondition, a) ? (a.convertToNoDocument(a.version).setHasLocalMutations(), null) : u;
  }(n, e, t);
}
function l_(n, e) {
  let t = null;
  for (const r of n.fieldTransforms) {
    const s = e.data.field(r.field), o = xl(r.transform, s || null);
    o != null && (t === null && (t = Ae.empty()), t.set(r.field, o));
  }
  return t || null;
}
function Uc(n, e) {
  return n.type === e.type && !!n.key.isEqual(e.key) && !!n.precondition.isEqual(e.precondition) && !!function(r, s) {
    return r === void 0 && s === void 0 || !(!r || !s) && rn(r, s, (o, a) => a_(o, a));
  }(n.fieldTransforms, e.fieldTransforms) && (n.type === 0 ? n.value.isEqual(e.value) : n.type !== 1 || n.data.isEqual(e.data) && n.fieldMask.isEqual(e.fieldMask));
}
class ur extends ks {
  constructor(e, t, r, s = []) {
    super(), this.key = e, this.value = t, this.precondition = r, this.fieldTransforms = s, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
}
class Rt extends ks {
  constructor(e, t, r, s, o = []) {
    super(), this.key = e, this.data = t, this.fieldMask = r, this.precondition = s, this.fieldTransforms = o, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
}
function ql(n) {
  const e = /* @__PURE__ */ new Map();
  return n.fieldMask.fields.forEach((t) => {
    if (!t.isEmpty()) {
      const r = n.data.field(t);
      e.set(t, r);
    }
  }), e;
}
function Fc(n, e, t) {
  const r = /* @__PURE__ */ new Map();
  G(n.length === t.length);
  for (let s = 0; s < t.length; s++) {
    const o = n[s], a = o.transform, u = e.data.field(o.field);
    r.set(o.field, o_(a, u, t[s]));
  }
  return r;
}
function Bc(n, e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const s of n) {
    const o = s.transform, a = t.data.field(s.field);
    r.set(s.field, i_(o, a, e));
  }
  return r;
}
class ho extends ks {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
class h_ extends ks {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class d_ {
  /**
   * @param batchId - The unique ID of this mutation batch.
   * @param localWriteTime - The original write time of this mutation.
   * @param baseMutations - Mutations that are used to populate the base
   * values when this mutation is applied locally. This can be used to locally
   * overwrite values that are persisted in the remote document cache. Base
   * mutations are never sent to the backend.
   * @param mutations - The user-provided mutations in this mutation batch.
   * User-provided mutations are applied both locally and remotely on the
   * backend.
   */
  constructor(e, t, r, s) {
    this.batchId = e, this.localWriteTime = t, this.baseMutations = r, this.mutations = s;
  }
  /**
   * Applies all the mutations in this MutationBatch to the specified document
   * to compute the state of the remote document
   *
   * @param document - The document to apply mutations to.
   * @param batchResult - The result of applying the MutationBatch to the
   * backend.
   */
  applyToRemoteDocument(e, t) {
    const r = t.mutationResults;
    for (let s = 0; s < this.mutations.length; s++) {
      const o = this.mutations[s];
      o.key.isEqual(e.key) && u_(o, e, r[s]);
    }
  }
  /**
   * Computes the local view of a document given all the mutations in this
   * batch.
   *
   * @param document - The document to apply mutations to.
   * @param mutatedFields - Fields that have been updated before applying this mutation batch.
   * @returns A `FieldMask` representing all the fields that are mutated.
   */
  applyToLocalView(e, t) {
    for (const r of this.baseMutations) r.key.isEqual(e.key) && (t = Wn(r, e, t, this.localWriteTime));
    for (const r of this.mutations) r.key.isEqual(e.key) && (t = Wn(r, e, t, this.localWriteTime));
    return t;
  }
  /**
   * Computes the local view for all provided documents given the mutations in
   * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
   * replace all the mutation applications.
   */
  applyToLocalDocumentSet(e, t) {
    const r = Ll();
    return this.mutations.forEach((s) => {
      const o = e.get(s.key), a = o.overlayedDocument;
      let u = this.applyToLocalView(a, o.mutatedFields);
      u = t.has(s.key) ? null : u;
      const l = jl(a, u);
      l !== null && r.set(s.key, l), a.isValidDocument() || a.convertToNoDocument(U.min());
    }), r;
  }
  keys() {
    return this.mutations.reduce((e, t) => e.add(t.key), q());
  }
  isEqual(e) {
    return this.batchId === e.batchId && rn(this.mutations, e.mutations, (t, r) => Uc(t, r)) && rn(this.baseMutations, e.baseMutations, (t, r) => Uc(t, r));
  }
}
class fo {
  constructor(e, t, r, s) {
    this.batch = e, this.commitVersion = t, this.mutationResults = r, this.docVersions = s;
  }
  /**
   * Creates a new MutationBatchResult for the given batch and results. There
   * must be one result for each mutation in the batch. This static factory
   * caches a document=&gt;version mapping (docVersions).
   */
  static from(e, t, r) {
    G(e.mutations.length === r.length);
    let s = /* @__PURE__ */ function() {
      return e_;
    }();
    const o = e.mutations;
    for (let a = 0; a < o.length; a++) s = s.insert(o[a].key, r[a].version);
    return new fo(e, t, r, s);
  }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class f_ {
  constructor(e, t) {
    this.largestBatchId = e, this.mutation = t;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return e !== null && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class p_ {
  constructor(e, t) {
    this.count = e, this.unchangedNames = t;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var re, $;
function m_(n) {
  switch (n) {
    case C.OK:
      return x();
    case C.CANCELLED:
    case C.UNKNOWN:
    case C.DEADLINE_EXCEEDED:
    case C.RESOURCE_EXHAUSTED:
    case C.INTERNAL:
    case C.UNAVAILABLE:
    case C.UNAUTHENTICATED:
      return !1;
    case C.INVALID_ARGUMENT:
    case C.NOT_FOUND:
    case C.ALREADY_EXISTS:
    case C.PERMISSION_DENIED:
    case C.FAILED_PRECONDITION:
    case C.ABORTED:
    case C.OUT_OF_RANGE:
    case C.UNIMPLEMENTED:
    case C.DATA_LOSS:
      return !0;
    default:
      return x();
  }
}
function $l(n) {
  if (n === void 0)
    return Ye("GRPC error has no .code"), C.UNKNOWN;
  switch (n) {
    case re.OK:
      return C.OK;
    case re.CANCELLED:
      return C.CANCELLED;
    case re.UNKNOWN:
      return C.UNKNOWN;
    case re.DEADLINE_EXCEEDED:
      return C.DEADLINE_EXCEEDED;
    case re.RESOURCE_EXHAUSTED:
      return C.RESOURCE_EXHAUSTED;
    case re.INTERNAL:
      return C.INTERNAL;
    case re.UNAVAILABLE:
      return C.UNAVAILABLE;
    case re.UNAUTHENTICATED:
      return C.UNAUTHENTICATED;
    case re.INVALID_ARGUMENT:
      return C.INVALID_ARGUMENT;
    case re.NOT_FOUND:
      return C.NOT_FOUND;
    case re.ALREADY_EXISTS:
      return C.ALREADY_EXISTS;
    case re.PERMISSION_DENIED:
      return C.PERMISSION_DENIED;
    case re.FAILED_PRECONDITION:
      return C.FAILED_PRECONDITION;
    case re.ABORTED:
      return C.ABORTED;
    case re.OUT_OF_RANGE:
      return C.OUT_OF_RANGE;
    case re.UNIMPLEMENTED:
      return C.UNIMPLEMENTED;
    case re.DATA_LOSS:
      return C.DATA_LOSS;
    default:
      return x();
  }
}
($ = re || (re = {}))[$.OK = 0] = "OK", $[$.CANCELLED = 1] = "CANCELLED", $[$.UNKNOWN = 2] = "UNKNOWN", $[$.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", $[$.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", $[$.NOT_FOUND = 5] = "NOT_FOUND", $[$.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", $[$.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", $[$.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", $[$.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", $[$.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", $[$.ABORTED = 10] = "ABORTED", $[$.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", $[$.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", $[$.INTERNAL = 13] = "INTERNAL", $[$.UNAVAILABLE = 14] = "UNAVAILABLE", $[$.DATA_LOSS = 15] = "DATA_LOSS";
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const g_ = new mt([4294967295, 4294967295], 0);
function jc(n) {
  const e = fl().encode(n), t = new ol();
  return t.update(e), new Uint8Array(t.digest());
}
function qc(n) {
  const e = new DataView(n.buffer), t = e.getUint32(
    0,
    /* littleEndian= */
    !0
  ), r = e.getUint32(
    4,
    /* littleEndian= */
    !0
  ), s = e.getUint32(
    8,
    /* littleEndian= */
    !0
  ), o = e.getUint32(
    12,
    /* littleEndian= */
    !0
  );
  return [new mt([t, r], 0), new mt([s, o], 0)];
}
class po {
  constructor(e, t, r) {
    if (this.bitmap = e, this.padding = t, this.hashCount = r, t < 0 || t >= 8) throw new Bn(`Invalid padding: ${t}`);
    if (r < 0) throw new Bn(`Invalid hash count: ${r}`);
    if (e.length > 0 && this.hashCount === 0)
      throw new Bn(`Invalid hash count: ${r}`);
    if (e.length === 0 && t !== 0)
      throw new Bn(`Invalid padding when bitmap length is 0: ${t}`);
    this.Ee = 8 * e.length - t, // Set the bit count in Integer to avoid repetition in mightContain().
    this.de = mt.fromNumber(this.Ee);
  }
  // Calculate the ith hash value based on the hashed 64bit integers,
  // and calculate its corresponding bit index in the bitmap to be checked.
  Ae(e, t, r) {
    let s = e.add(t.multiply(mt.fromNumber(r)));
    return s.compare(g_) === 1 && (s = new mt([s.getBits(0), s.getBits(1)], 0)), s.modulo(this.de).toNumber();
  }
  // Return whether the bit on the given index in the bitmap is set to 1.
  Re(e) {
    return !!(this.bitmap[Math.floor(e / 8)] & 1 << e % 8);
  }
  mightContain(e) {
    if (this.Ee === 0) return !1;
    const t = jc(e), [r, s] = qc(t);
    for (let o = 0; o < this.hashCount; o++) {
      const a = this.Ae(r, s, o);
      if (!this.Re(a)) return !1;
    }
    return !0;
  }
  /** Create bloom filter for testing purposes only. */
  static create(e, t, r) {
    const s = e % 8 == 0 ? 0 : 8 - e % 8, o = new Uint8Array(Math.ceil(e / 8)), a = new po(o, s, t);
    return r.forEach((u) => a.insert(u)), a;
  }
  insert(e) {
    if (this.Ee === 0) return;
    const t = jc(e), [r, s] = qc(t);
    for (let o = 0; o < this.hashCount; o++) {
      const a = this.Ae(r, s, o);
      this.Ve(a);
    }
  }
  Ve(e) {
    const t = Math.floor(e / 8), r = e % 8;
    this.bitmap[t] |= 1 << r;
  }
}
class Bn extends Error {
  constructor() {
    super(...arguments), this.name = "BloomFilterError";
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Vs {
  constructor(e, t, r, s, o) {
    this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = r, this.documentUpdates = s, this.resolvedLimboDocuments = o;
  }
  /**
   * HACK: Views require RemoteEvents in order to determine whether the view is
   * CURRENT, but secondary tabs don't receive remote events. So this method is
   * used to create a synthesized RemoteEvent that can be used to apply a
   * CURRENT status change to a View, for queries executed in a different tab.
   */
  // PORTING NOTE: Multi-tab only
  static createSynthesizedRemoteEventForCurrentChange(e, t, r) {
    const s = /* @__PURE__ */ new Map();
    return s.set(e, lr.createSynthesizedTargetChangeForCurrentChange(e, t, r)), new Vs(U.min(), s, new Y(B), Ze(), q());
  }
}
class lr {
  constructor(e, t, r, s, o) {
    this.resumeToken = e, this.current = t, this.addedDocuments = r, this.modifiedDocuments = s, this.removedDocuments = o;
  }
  /**
   * This method is used to create a synthesized TargetChanges that can be used to
   * apply a CURRENT status change to a View (for queries executed in a different
   * tab) or for new queries (to raise snapshots with correct CURRENT status).
   */
  static createSynthesizedTargetChangeForCurrentChange(e, t, r) {
    return new lr(r, t, q(), q(), q());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Gr {
  constructor(e, t, r, s) {
    this.me = e, this.removedTargetIds = t, this.key = r, this.fe = s;
  }
}
class zl {
  constructor(e, t) {
    this.targetId = e, this.ge = t;
  }
}
class Hl {
  constructor(e, t, r = de.EMPTY_BYTE_STRING, s = null) {
    this.state = e, this.targetIds = t, this.resumeToken = r, this.cause = s;
  }
}
class $c {
  constructor() {
    this.pe = 0, /**
     * Keeps track of the document changes since the last raised snapshot.
     *
     * These changes are continuously updated as we receive document updates and
     * always reflect the current set of changes against the last issued snapshot.
     */
    this.ye = zc(), /** See public getters for explanations of these fields. */
    this.we = de.EMPTY_BYTE_STRING, this.Se = !1, /**
     * Whether this target state should be included in the next snapshot. We
     * initialize to true so that newly-added targets are included in the next
     * RemoteEvent.
     */
    this.be = !0;
  }
  /**
   * Whether this target has been marked 'current'.
   *
   * 'Current' has special meaning in the RPC protocol: It implies that the
   * Watch backend has sent us all changes up to the point at which the target
   * was added and that the target is consistent with the rest of the watch
   * stream.
   */
  get current() {
    return this.Se;
  }
  /** The last resume token sent to us for this target. */
  get resumeToken() {
    return this.we;
  }
  /** Whether this target has pending target adds or target removes. */
  get De() {
    return this.pe !== 0;
  }
  /** Whether we have modified any state that should trigger a snapshot. */
  get ve() {
    return this.be;
  }
  /**
   * Applies the resume token to the TargetChange, but only when it has a new
   * value. Empty resumeTokens are discarded.
   */
  Ce(e) {
    e.approximateByteSize() > 0 && (this.be = !0, this.we = e);
  }
  /**
   * Creates a target change from the current set of changes.
   *
   * To reset the document changes after raising this snapshot, call
   * `clearPendingChanges()`.
   */
  Fe() {
    let e = q(), t = q(), r = q();
    return this.ye.forEach((s, o) => {
      switch (o) {
        case 0:
          e = e.add(s);
          break;
        case 2:
          t = t.add(s);
          break;
        case 1:
          r = r.add(s);
          break;
        default:
          x();
      }
    }), new lr(this.we, this.Se, e, t, r);
  }
  /**
   * Resets the document changes and sets `hasPendingChanges` to false.
   */
  Me() {
    this.be = !1, this.ye = zc();
  }
  xe(e, t) {
    this.be = !0, this.ye = this.ye.insert(e, t);
  }
  Oe(e) {
    this.be = !0, this.ye = this.ye.remove(e);
  }
  Ne() {
    this.pe += 1;
  }
  Be() {
    this.pe -= 1, G(this.pe >= 0);
  }
  Le() {
    this.be = !0, this.Se = !0;
  }
}
class __ {
  constructor(e) {
    this.ke = e, /** The internal state of all tracked targets. */
    this.qe = /* @__PURE__ */ new Map(), /** Keeps track of the documents to update since the last raised snapshot. */
    this.Qe = Ze(), this.$e = Mr(), /** A mapping of document keys to their set of target IDs. */
    this.Ue = Mr(), /**
     * A map of targets with existence filter mismatches. These targets are
     * known to be inconsistent and their listens needs to be re-established by
     * RemoteStore.
     */
    this.Ke = new Y(B);
  }
  /**
   * Processes and adds the DocumentWatchChange to the current set of changes.
   */
  We(e) {
    for (const t of e.me) e.fe && e.fe.isFoundDocument() ? this.Ge(t, e.fe) : this.ze(t, e.key, e.fe);
    for (const t of e.removedTargetIds) this.ze(t, e.key, e.fe);
  }
  /** Processes and adds the WatchTargetChange to the current set of changes. */
  je(e) {
    this.forEachTarget(e, (t) => {
      const r = this.He(t);
      switch (e.state) {
        case 0:
          this.Je(t) && r.Ce(e.resumeToken);
          break;
        case 1:
          r.Be(), r.De || // We have a freshly added target, so we need to reset any state
          // that we had previously. This can happen e.g. when remove and add
          // back a target for existence filter mismatches.
          r.Me(), r.Ce(e.resumeToken);
          break;
        case 2:
          r.Be(), r.De || this.removeTarget(t);
          break;
        case 3:
          this.Je(t) && (r.Le(), r.Ce(e.resumeToken));
          break;
        case 4:
          this.Je(t) && // Reset the target and synthesizes removes for all existing
          // documents. The backend will re-add any documents that still
          // match the target before it sends the next global snapshot.
          (this.Ye(t), r.Ce(e.resumeToken));
          break;
        default:
          x();
      }
    });
  }
  /**
   * Iterates over all targetIds that the watch change applies to: either the
   * targetIds explicitly listed in the change or the targetIds of all currently
   * active targets.
   */
  forEachTarget(e, t) {
    e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.qe.forEach((r, s) => {
      this.Je(s) && t(s);
    });
  }
  /**
   * Handles existence filters and synthesizes deletes for filter mismatches.
   * Targets that are invalidated by filter mismatches are added to
   * `pendingTargetResets`.
   */
  Ze(e) {
    const t = e.targetId, r = e.ge.count, s = this.Xe(t);
    if (s) {
      const o = s.target;
      if (Ni(o)) if (r === 0) {
        const a = new L(o.path);
        this.ze(t, a, ve.newNoDocument(a, U.min()));
      } else G(r === 1);
      else {
        const a = this.et(t);
        if (a !== r) {
          const u = this.tt(e), l = u ? this.nt(u, e, a) : 1;
          if (l !== 0) {
            this.Ye(t);
            const d = l === 2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
            this.Ke = this.Ke.insert(t, d);
          }
        }
      }
    }
  }
  /**
   * Parse the bloom filter from the "unchanged_names" field of an existence
   * filter.
   */
  tt(e) {
    const t = e.ge.unchangedNames;
    if (!t || !t.bits) return null;
    const { bits: { bitmap: r = "", padding: s = 0 }, hashCount: o = 0 } = t;
    let a, u;
    try {
      a = vt(r).toUint8Array();
    } catch (l) {
      if (l instanceof _l) return nn("Decoding the base64 bloom filter in existence filter failed (" + l.message + "); ignoring the bloom filter and falling back to full re-query."), null;
      throw l;
    }
    try {
      u = new po(a, s, o);
    } catch (l) {
      return nn(l instanceof Bn ? "BloomFilter error: " : "Applying bloom filter failed: ", l), null;
    }
    return u.Ee === 0 ? null : u;
  }
  /**
   * Apply bloom filter to remove the deleted documents, and return the
   * application status.
   */
  nt(e, t, r) {
    return t.ge.count === r - this.st(e, t.targetId) ? 0 : 2;
  }
  /**
   * Filter out removed documents based on bloom filter membership result and
   * return number of documents removed.
   */
  st(e, t) {
    const r = this.ke.getRemoteKeysForTarget(t);
    let s = 0;
    return r.forEach((o) => {
      const a = this.ke.it(), u = `projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;
      e.mightContain(u) || (this.ze(
        t,
        o,
        /*updatedDocument=*/
        null
      ), s++);
    }), s;
  }
  /**
   * Converts the currently accumulated state into a remote event at the
   * provided snapshot version. Resets the accumulated changes before returning.
   */
  ot(e) {
    const t = /* @__PURE__ */ new Map();
    this.qe.forEach((o, a) => {
      const u = this.Xe(a);
      if (u) {
        if (o.current && Ni(u.target)) {
          const l = new L(u.target.path);
          this._t(l).has(a) || this.ut(a, l) || this.ze(a, l, ve.newNoDocument(l, e));
        }
        o.ve && (t.set(a, o.Fe()), o.Me());
      }
    });
    let r = q();
    this.Ue.forEach((o, a) => {
      let u = !0;
      a.forEachWhile((l) => {
        const d = this.Xe(l);
        return !d || d.purpose === "TargetPurposeLimboResolution" || (u = !1, !1);
      }), u && (r = r.add(o));
    }), this.Qe.forEach((o, a) => a.setReadTime(e));
    const s = new Vs(e, t, this.Ke, this.Qe, r);
    return this.Qe = Ze(), this.$e = Mr(), this.Ue = Mr(), this.Ke = new Y(B), s;
  }
  /**
   * Adds the provided document to the internal list of document updates and
   * its document key to the given target's mapping.
   */
  // Visible for testing.
  Ge(e, t) {
    if (!this.Je(e)) return;
    const r = this.ut(e, t.key) ? 2 : 0;
    this.He(e).xe(t.key, r), this.Qe = this.Qe.insert(t.key, t), this.$e = this.$e.insert(t.key, this._t(t.key).add(e)), this.Ue = this.Ue.insert(t.key, this.ct(t.key).add(e));
  }
  /**
   * Removes the provided document from the target mapping. If the
   * document no longer matches the target, but the document's state is still
   * known (e.g. we know that the document was deleted or we received the change
   * that caused the filter mismatch), the new document can be provided
   * to update the remote document cache.
   */
  // Visible for testing.
  ze(e, t, r) {
    if (!this.Je(e)) return;
    const s = this.He(e);
    this.ut(e, t) ? s.xe(
      t,
      1
      /* ChangeType.Removed */
    ) : (
      // The document may have entered and left the target before we raised a
      // snapshot, so we can just ignore the change.
      s.Oe(t)
    ), this.Ue = this.Ue.insert(t, this.ct(t).delete(e)), this.Ue = this.Ue.insert(t, this.ct(t).add(e)), r && (this.Qe = this.Qe.insert(t, r));
  }
  removeTarget(e) {
    this.qe.delete(e);
  }
  /**
   * Returns the current count of documents in the target. This includes both
   * the number of documents that the LocalStore considers to be part of the
   * target as well as any accumulated changes.
   */
  et(e) {
    const t = this.He(e).Fe();
    return this.ke.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
  }
  /**
   * Increment the number of acks needed from watch before we can consider the
   * server to be 'in-sync' with the client's active targets.
   */
  Ne(e) {
    this.He(e).Ne();
  }
  He(e) {
    let t = this.qe.get(e);
    return t || (t = new $c(), this.qe.set(e, t)), t;
  }
  ct(e) {
    let t = this.Ue.get(e);
    return t || (t = new oe(B), this.Ue = this.Ue.insert(e, t)), t;
  }
  _t(e) {
    let t = this.$e.get(e);
    return t || (t = new oe(B), this.$e = this.$e.insert(e, t)), t;
  }
  /**
   * Verifies that the user is still interested in this target (by calling
   * `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
   * from watch.
   */
  Je(e) {
    const t = this.Xe(e) !== null;
    return t || D("WatchChangeAggregator", "Detected inactive target", e), t;
  }
  /**
   * Returns the TargetData for an active target (i.e. a target that the user
   * is still interested in that has no outstanding target change requests).
   */
  Xe(e) {
    const t = this.qe.get(e);
    return t && t.De ? null : this.ke.lt(e);
  }
  /**
   * Resets the state of a Watch target to its initial state (e.g. sets
   * 'current' to false, clears the resume token and removes its target mapping
   * from all documents).
   */
  Ye(e) {
    this.qe.set(e, new $c()), this.ke.getRemoteKeysForTarget(e).forEach((t) => {
      this.ze(
        e,
        t,
        /*updatedDocument=*/
        null
      );
    });
  }
  /**
   * Returns whether the LocalStore considers the document to be part of the
   * specified target.
   */
  ut(e, t) {
    return this.ke.getRemoteKeysForTarget(e).has(t);
  }
}
function Mr() {
  return new Y(L.comparator);
}
function zc() {
  return new Y(L.comparator);
}
const y_ = {
  asc: "ASCENDING",
  desc: "DESCENDING"
}, v_ = {
  "<": "LESS_THAN",
  "<=": "LESS_THAN_OR_EQUAL",
  ">": "GREATER_THAN",
  ">=": "GREATER_THAN_OR_EQUAL",
  "==": "EQUAL",
  "!=": "NOT_EQUAL",
  "array-contains": "ARRAY_CONTAINS",
  in: "IN",
  "not-in": "NOT_IN",
  "array-contains-any": "ARRAY_CONTAINS_ANY"
}, E_ = {
  and: "AND",
  or: "OR"
};
class T_ {
  constructor(e, t) {
    this.databaseId = e, this.useProto3Json = t;
  }
}
function Li(n, e) {
  return n.useProto3Json || As(e) ? e : {
    value: e
  };
}
function hs(n, e) {
  return n.useProto3Json ? `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z` : {
    seconds: "" + e.seconds,
    nanos: e.nanoseconds
  };
}
function Wl(n, e) {
  return n.useProto3Json ? e.toBase64() : e.toUint8Array();
}
function I_(n, e) {
  return hs(n, e.toTimestamp());
}
function Fe(n) {
  return G(!!n), U.fromTimestamp(function(t) {
    const r = yt(t);
    return new ie(r.seconds, r.nanos);
  }(n));
}
function mo(n, e) {
  return Mi(n, e).canonicalString();
}
function Mi(n, e) {
  const t = function(s) {
    return new X(["projects", s.projectId, "databases", s.database]);
  }(n).child("documents");
  return e === void 0 ? t : t.child(e);
}
function Kl(n) {
  const e = X.fromString(n);
  return G(Yl(e)), e;
}
function xi(n, e) {
  return mo(n.databaseId, e.path);
}
function _i(n, e) {
  const t = Kl(e);
  if (t.get(1) !== n.databaseId.projectId) throw new O(C.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + t.get(1) + " vs " + n.databaseId.projectId);
  if (t.get(3) !== n.databaseId.database) throw new O(C.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + t.get(3) + " vs " + n.databaseId.database);
  return new L(Ql(t));
}
function Gl(n, e) {
  return mo(n.databaseId, e);
}
function w_(n) {
  const e = Kl(n);
  return e.length === 4 ? X.emptyPath() : Ql(e);
}
function Ui(n) {
  return new X(["projects", n.databaseId.projectId, "databases", n.databaseId.database]).canonicalString();
}
function Ql(n) {
  return G(n.length > 4 && n.get(4) === "documents"), n.popFirst(5);
}
function Hc(n, e, t) {
  return {
    name: xi(n, e),
    fields: t.value.mapValue.fields
  };
}
function A_(n, e) {
  let t;
  if ("targetChange" in e) {
    e.targetChange;
    const r = function(d) {
      return d === "NO_CHANGE" ? 0 : d === "ADD" ? 1 : d === "REMOVE" ? 2 : d === "CURRENT" ? 3 : d === "RESET" ? 4 : x();
    }(e.targetChange.targetChangeType || "NO_CHANGE"), s = e.targetChange.targetIds || [], o = function(d, p) {
      return d.useProto3Json ? (G(p === void 0 || typeof p == "string"), de.fromBase64String(p || "")) : (G(p === void 0 || // Check if the value is an instance of both Buffer and Uint8Array,
      // despite the fact that Buffer extends Uint8Array. In some
      // environments, such as jsdom, the prototype chain of Buffer
      // does not indicate that it extends Uint8Array.
      p instanceof Buffer || p instanceof Uint8Array), de.fromUint8Array(p || new Uint8Array()));
    }(n, e.targetChange.resumeToken), a = e.targetChange.cause, u = a && function(d) {
      const p = d.code === void 0 ? C.UNKNOWN : $l(d.code);
      return new O(p, d.message || "");
    }(a);
    t = new Hl(r, s, o, u || null);
  } else if ("documentChange" in e) {
    e.documentChange;
    const r = e.documentChange;
    r.document, r.document.name, r.document.updateTime;
    const s = _i(n, r.document.name), o = Fe(r.document.updateTime), a = r.document.createTime ? Fe(r.document.createTime) : U.min(), u = new Ae({
      mapValue: {
        fields: r.document.fields
      }
    }), l = ve.newFoundDocument(s, o, a, u), d = r.targetIds || [], p = r.removedTargetIds || [];
    t = new Gr(d, p, l.key, l);
  } else if ("documentDelete" in e) {
    e.documentDelete;
    const r = e.documentDelete;
    r.document;
    const s = _i(n, r.document), o = r.readTime ? Fe(r.readTime) : U.min(), a = ve.newNoDocument(s, o), u = r.removedTargetIds || [];
    t = new Gr([], u, a.key, a);
  } else if ("documentRemove" in e) {
    e.documentRemove;
    const r = e.documentRemove;
    r.document;
    const s = _i(n, r.document), o = r.removedTargetIds || [];
    t = new Gr([], o, s, null);
  } else {
    if (!("filter" in e)) return x();
    {
      e.filter;
      const r = e.filter;
      r.targetId;
      const { count: s = 0, unchangedNames: o } = r, a = new p_(s, o), u = r.targetId;
      t = new zl(u, a);
    }
  }
  return t;
}
function R_(n, e) {
  let t;
  if (e instanceof ur) t = {
    update: Hc(n, e.key, e.value)
  };
  else if (e instanceof ho) t = {
    delete: xi(n, e.key)
  };
  else if (e instanceof Rt) t = {
    update: Hc(n, e.key, e.data),
    updateMask: O_(e.fieldMask)
  };
  else {
    if (!(e instanceof h_)) return x();
    t = {
      verify: xi(n, e.key)
    };
  }
  return e.fieldTransforms.length > 0 && (t.updateTransforms = e.fieldTransforms.map((r) => function(o, a) {
    const u = a.transform;
    if (u instanceof us) return {
      fieldPath: a.field.canonicalString(),
      setToServerValue: "REQUEST_TIME"
    };
    if (u instanceof tr) return {
      fieldPath: a.field.canonicalString(),
      appendMissingElements: {
        values: u.elements
      }
    };
    if (u instanceof nr) return {
      fieldPath: a.field.canonicalString(),
      removeAllFromArray: {
        values: u.elements
      }
    };
    if (u instanceof ls) return {
      fieldPath: a.field.canonicalString(),
      increment: u.Ie
    };
    throw x();
  }(0, r))), e.precondition.isNone || (t.currentDocument = function(s, o) {
    return o.updateTime !== void 0 ? {
      updateTime: I_(s, o.updateTime)
    } : o.exists !== void 0 ? {
      exists: o.exists
    } : x();
  }(n, e.precondition)), t;
}
function S_(n, e) {
  return n && n.length > 0 ? (G(e !== void 0), n.map((t) => function(s, o) {
    let a = s.updateTime ? Fe(s.updateTime) : Fe(o);
    return a.isEqual(U.min()) && // The Firestore Emulator currently returns an update time of 0 for
    // deletes of non-existing documents (rather than null). This breaks the
    // test "get deleted doc while offline with source=cache" as NoDocuments
    // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
    // TODO(#2149): Remove this when Emulator is fixed
    (a = Fe(o)), new c_(a, s.transformResults || []);
  }(t, e))) : [];
}
function P_(n, e) {
  return {
    documents: [Gl(n, e.path)]
  };
}
function C_(n, e) {
  const t = {
    structuredQuery: {}
  }, r = e.path;
  let s;
  e.collectionGroup !== null ? (s = r, t.structuredQuery.from = [{
    collectionId: e.collectionGroup,
    allDescendants: !0
  }]) : (s = r.popLast(), t.structuredQuery.from = [{
    collectionId: r.lastSegment()
  }]), t.parent = Gl(n, s);
  const o = function(d) {
    if (d.length !== 0)
      return Xl(je.create(
        d,
        "and"
        /* CompositeOperator.AND */
      ));
  }(e.filters);
  o && (t.structuredQuery.where = o);
  const a = function(d) {
    if (d.length !== 0)
      return d.map((p) => (
        // visible for testing
        function(w) {
          return {
            field: Kt(w.field),
            direction: V_(w.dir)
          };
        }(p)
      ));
  }(e.orderBy);
  a && (t.structuredQuery.orderBy = a);
  const u = Li(n, e.limit);
  return u !== null && (t.structuredQuery.limit = u), e.startAt && (t.structuredQuery.startAt = function(d) {
    return {
      before: d.inclusive,
      values: d.position
    };
  }(e.startAt)), e.endAt && (t.structuredQuery.endAt = function(d) {
    return {
      before: !d.inclusive,
      values: d.position
    };
  }(e.endAt)), {
    ht: t,
    parent: s
  };
}
function b_(n) {
  let e = w_(n.parent);
  const t = n.structuredQuery, r = t.from ? t.from.length : 0;
  let s = null;
  if (r > 0) {
    G(r === 1);
    const p = t.from[0];
    p.allDescendants ? s = p.collectionId : e = e.child(p.collectionId);
  }
  let o = [];
  t.where && (o = function(y) {
    const w = Jl(y);
    return w instanceof je && Pl(w) ? w.getFilters() : [w];
  }(t.where));
  let a = [];
  t.orderBy && (a = function(y) {
    return y.map((w) => function(k) {
      return new cs(
        Gt(k.field),
        // visible for testing
        function(V) {
          switch (V) {
            case "ASCENDING":
              return "asc";
            case "DESCENDING":
              return "desc";
            default:
              return;
          }
        }(k.direction)
      );
    }(w));
  }(t.orderBy));
  let u = null;
  t.limit && (u = function(y) {
    let w;
    return w = typeof y == "object" ? y.value : y, As(w) ? null : w;
  }(t.limit));
  let l = null;
  t.startAt && (l = function(y) {
    const w = !!y.before, P = y.values || [];
    return new as(P, w);
  }(t.startAt));
  let d = null;
  return t.endAt && (d = function(y) {
    const w = !y.before, P = y.values || [];
    return new as(P, w);
  }(t.endAt)), Gg(e, s, a, o, u, "F", l, d);
}
function k_(n, e) {
  const t = function(s) {
    switch (s) {
      case "TargetPurposeListen":
        return null;
      case "TargetPurposeExistenceFilterMismatch":
        return "existence-filter-mismatch";
      case "TargetPurposeExistenceFilterMismatchBloom":
        return "existence-filter-mismatch-bloom";
      case "TargetPurposeLimboResolution":
        return "limbo-document";
      default:
        return x();
    }
  }(e.purpose);
  return t == null ? null : {
    "goog-listen-tags": t
  };
}
function Jl(n) {
  return n.unaryFilter !== void 0 ? function(t) {
    switch (t.unaryFilter.op) {
      case "IS_NAN":
        const r = Gt(t.unaryFilter.field);
        return se.create(r, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const s = Gt(t.unaryFilter.field);
        return se.create(s, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const o = Gt(t.unaryFilter.field);
        return se.create(o, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const a = Gt(t.unaryFilter.field);
        return se.create(a, "!=", {
          nullValue: "NULL_VALUE"
        });
      default:
        return x();
    }
  }(n) : n.fieldFilter !== void 0 ? function(t) {
    return se.create(Gt(t.fieldFilter.field), function(s) {
      switch (s) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        default:
          return x();
      }
    }(t.fieldFilter.op), t.fieldFilter.value);
  }(n) : n.compositeFilter !== void 0 ? function(t) {
    return je.create(t.compositeFilter.filters.map((r) => Jl(r)), function(s) {
      switch (s) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return x();
      }
    }(t.compositeFilter.op));
  }(n) : x();
}
function V_(n) {
  return y_[n];
}
function D_(n) {
  return v_[n];
}
function N_(n) {
  return E_[n];
}
function Kt(n) {
  return {
    fieldPath: n.canonicalString()
  };
}
function Gt(n) {
  return le.fromServerFormat(n.fieldPath);
}
function Xl(n) {
  return n instanceof se ? function(t) {
    if (t.op === "==") {
      if (Dc(t.value)) return {
        unaryFilter: {
          field: Kt(t.field),
          op: "IS_NAN"
        }
      };
      if (Vc(t.value)) return {
        unaryFilter: {
          field: Kt(t.field),
          op: "IS_NULL"
        }
      };
    } else if (t.op === "!=") {
      if (Dc(t.value)) return {
        unaryFilter: {
          field: Kt(t.field),
          op: "IS_NOT_NAN"
        }
      };
      if (Vc(t.value)) return {
        unaryFilter: {
          field: Kt(t.field),
          op: "IS_NOT_NULL"
        }
      };
    }
    return {
      fieldFilter: {
        field: Kt(t.field),
        op: D_(t.op),
        value: t.value
      }
    };
  }(n) : n instanceof je ? function(t) {
    const r = t.getFilters().map((s) => Xl(s));
    return r.length === 1 ? r[0] : {
      compositeFilter: {
        op: N_(t.op),
        filters: r
      }
    };
  }(n) : x();
}
function O_(n) {
  const e = [];
  return n.fields.forEach((t) => e.push(t.canonicalString())), {
    fieldPaths: e
  };
}
function Yl(n) {
  return n.length >= 4 && n.get(0) === "projects" && n.get(2) === "databases";
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class lt {
  constructor(e, t, r, s, o = U.min(), a = U.min(), u = de.EMPTY_BYTE_STRING, l = null) {
    this.target = e, this.targetId = t, this.purpose = r, this.sequenceNumber = s, this.snapshotVersion = o, this.lastLimboFreeSnapshotVersion = a, this.resumeToken = u, this.expectedCount = l;
  }
  /** Creates a new target data instance with an updated sequence number. */
  withSequenceNumber(e) {
    return new lt(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
  }
  /**
   * Creates a new target data instance with an updated resume token and
   * snapshot version.
   */
  withResumeToken(e, t) {
    return new lt(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      t,
      this.lastLimboFreeSnapshotVersion,
      e,
      /* expectedCount= */
      null
    );
  }
  /**
   * Creates a new target data instance with an updated expected count.
   */
  withExpectedCount(e) {
    return new lt(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
  }
  /**
   * Creates a new target data instance with an updated last limbo free
   * snapshot version number.
   */
  withLastLimboFreeSnapshotVersion(e) {
    return new lt(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class L_ {
  constructor(e) {
    this.Tt = e;
  }
}
function M_(n) {
  const e = b_({
    parent: n.parent,
    structuredQuery: n.structuredQuery
  });
  return n.limitType === "LAST" ? Oi(
    e,
    e.limit,
    "L"
    /* LimitType.Last */
  ) : e;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class x_ {
  constructor() {
    this.Tn = new U_();
  }
  addToCollectionParentIndex(e, t) {
    return this.Tn.add(t), S.resolve();
  }
  getCollectionParents(e, t) {
    return S.resolve(this.Tn.getEntries(t));
  }
  addFieldIndex(e, t) {
    return S.resolve();
  }
  deleteFieldIndex(e, t) {
    return S.resolve();
  }
  deleteAllFieldIndexes(e) {
    return S.resolve();
  }
  createTargetIndexes(e, t) {
    return S.resolve();
  }
  getDocumentsMatchingTarget(e, t) {
    return S.resolve(null);
  }
  getIndexType(e, t) {
    return S.resolve(
      0
      /* IndexType.NONE */
    );
  }
  getFieldIndexes(e, t) {
    return S.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return S.resolve(null);
  }
  getMinOffset(e, t) {
    return S.resolve(_t.min());
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return S.resolve(_t.min());
  }
  updateCollectionGroup(e, t, r) {
    return S.resolve();
  }
  updateIndexEntries(e, t) {
    return S.resolve();
  }
}
class U_ {
  constructor() {
    this.index = {};
  }
  // Returns false if the entry already existed.
  add(e) {
    const t = e.lastSegment(), r = e.popLast(), s = this.index[t] || new oe(X.comparator), o = !s.has(r);
    return this.index[t] = s.add(r), o;
  }
  has(e) {
    const t = e.lastSegment(), r = e.popLast(), s = this.index[t];
    return s && s.has(r);
  }
  getEntries(e) {
    return (this.index[e] || new oe(X.comparator)).toArray();
  }
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Wc = {
  didRun: !1,
  sequenceNumbersCollected: 0,
  targetsRemoved: 0,
  documentsRemoved: 0
}, Zl = 41943040;
class we {
  static withCacheSize(e) {
    return new we(e, we.DEFAULT_COLLECTION_PERCENTILE, we.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
  constructor(e, t, r) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = r;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
we.DEFAULT_COLLECTION_PERCENTILE = 10, we.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, we.DEFAULT = new we(Zl, we.DEFAULT_COLLECTION_PERCENTILE, we.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), we.DISABLED = new we(-1, 0, 0);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class an {
  constructor(e) {
    this.$n = e;
  }
  next() {
    return this.$n += 2, this.$n;
  }
  static Un() {
    return new an(0);
  }
  static Kn() {
    return new an(-1);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Kc = "LruGarbageCollector", F_ = 1048576;
function Gc([n, e], [t, r]) {
  const s = B(n, t);
  return s === 0 ? B(e, r) : s;
}
class B_ {
  constructor(e) {
    this.Hn = e, this.buffer = new oe(Gc), this.Jn = 0;
  }
  Yn() {
    return ++this.Jn;
  }
  Zn(e) {
    const t = [e, this.Yn()];
    if (this.buffer.size < this.Hn) this.buffer = this.buffer.add(t);
    else {
      const r = this.buffer.last();
      Gc(t, r) < 0 && (this.buffer = this.buffer.delete(r).add(t));
    }
  }
  get maxValue() {
    return this.buffer.last()[0];
  }
}
class j_ {
  constructor(e, t, r) {
    this.garbageCollector = e, this.asyncQueue = t, this.localStore = r, this.Xn = null;
  }
  start() {
    this.garbageCollector.params.cacheSizeCollectionThreshold !== -1 && this.er(6e4);
  }
  stop() {
    this.Xn && (this.Xn.cancel(), this.Xn = null);
  }
  get started() {
    return this.Xn !== null;
  }
  er(e) {
    D(Kc, `Garbage collection scheduled in ${e}ms`), this.Xn = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, async () => {
      this.Xn = null;
      try {
        await this.localStore.collectGarbage(this.garbageCollector);
      } catch (t) {
        gn(t) ? D(Kc, "Ignoring IndexedDB error during garbage collection: ", t) : await mn(t);
      }
      await this.er(3e5);
    });
  }
}
class q_ {
  constructor(e, t) {
    this.tr = e, this.params = t;
  }
  calculateTargetCount(e, t) {
    return this.tr.nr(e).next((r) => Math.floor(t / 100 * r));
  }
  nthSequenceNumber(e, t) {
    if (t === 0) return S.resolve(ws.ae);
    const r = new B_(t);
    return this.tr.forEachTarget(e, (s) => r.Zn(s.sequenceNumber)).next(() => this.tr.rr(e, (s) => r.Zn(s))).next(() => r.maxValue);
  }
  removeTargets(e, t, r) {
    return this.tr.removeTargets(e, t, r);
  }
  removeOrphanedDocuments(e, t) {
    return this.tr.removeOrphanedDocuments(e, t);
  }
  collect(e, t) {
    return this.params.cacheSizeCollectionThreshold === -1 ? (D("LruGarbageCollector", "Garbage collection skipped; disabled"), S.resolve(Wc)) : this.getCacheSize(e).next((r) => r < this.params.cacheSizeCollectionThreshold ? (D("LruGarbageCollector", `Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), Wc) : this.ir(e, t));
  }
  getCacheSize(e) {
    return this.tr.getCacheSize(e);
  }
  ir(e, t) {
    let r, s, o, a, u, l, d;
    const p = Date.now();
    return this.calculateTargetCount(e, this.params.percentileToCollect).next((y) => (
      // Cap at the configured max
      (y > this.params.maximumSequenceNumbersToCollect ? (D("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${y}`), s = this.params.maximumSequenceNumbersToCollect) : s = y, a = Date.now(), this.nthSequenceNumber(e, s))
    )).next((y) => (r = y, u = Date.now(), this.removeTargets(e, r, t))).next((y) => (o = y, l = Date.now(), this.removeOrphanedDocuments(e, r))).next((y) => (d = Date.now(), Ht() <= j.DEBUG && D("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${a - p}ms
	Determined least recently used ${s} in ` + (u - a) + `ms
	Removed ${o} targets in ` + (l - u) + `ms
	Removed ${y} documents in ` + (d - l) + `ms
Total Duration: ${d - p}ms`), S.resolve({
      didRun: !0,
      sequenceNumbersCollected: s,
      targetsRemoved: o,
      documentsRemoved: y
    })));
  }
}
function $_(n, e) {
  return new q_(n, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class z_ {
  constructor() {
    this.changes = new Ft((e) => e.toString(), (e, t) => e.isEqual(t)), this.changesApplied = !1;
  }
  /**
   * Buffers a `RemoteDocumentCache.addEntry()` call.
   *
   * You can only modify documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e);
  }
  /**
   * Buffers a `RemoteDocumentCache.removeEntry()` call.
   *
   * You can only remove documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  removeEntry(e, t) {
    this.assertNotApplied(), this.changes.set(e, ve.newInvalidDocument(e).setReadTime(t));
  }
  /**
   * Looks up an entry in the cache. The buffered changes will first be checked,
   * and if no buffered change applies, this will forward to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKey - The key of the entry to look up.
   * @returns The cached document or an invalid document if we have nothing
   * cached.
   */
  getEntry(e, t) {
    this.assertNotApplied();
    const r = this.changes.get(t);
    return r !== void 0 ? S.resolve(r) : this.getFromCache(e, t);
  }
  /**
   * Looks up several entries in the cache, forwarding to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKeys - The keys of the entries to look up.
   * @returns A map of cached documents, indexed by key. If an entry cannot be
   *     found, the corresponding key will be mapped to an invalid document.
   */
  getEntries(e, t) {
    return this.getAllFromCache(e, t);
  }
  /**
   * Applies buffered changes to the underlying RemoteDocumentCache, using
   * the provided transaction.
   */
  apply(e) {
    return this.assertNotApplied(), this.changesApplied = !0, this.applyChanges(e);
  }
  /** Helper to assert this.changes is not null  */
  assertNotApplied() {
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class H_ {
  constructor(e, t) {
    this.overlayedDocument = e, this.mutatedFields = t;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class W_ {
  constructor(e, t, r, s) {
    this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = r, this.indexManager = s;
  }
  /**
   * Get the local view of the document identified by `key`.
   *
   * @returns Local view of the document or null if we don't have any cached
   * state for it.
   */
  getDocument(e, t) {
    let r = null;
    return this.documentOverlayCache.getOverlay(e, t).next((s) => (r = s, this.remoteDocumentCache.getEntry(e, t))).next((s) => (r !== null && Wn(r.mutation, s, Pe.empty(), ie.now()), s));
  }
  /**
   * Gets the local view of the documents identified by `keys`.
   *
   * If we don't have cached state for a document in `keys`, a NoDocument will
   * be stored for that key in the resulting set.
   */
  getDocuments(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((r) => this.getLocalViewOfDocuments(e, r, q()).next(() => r));
  }
  /**
   * Similar to `getDocuments`, but creates the local view from the given
   * `baseDocs` without retrieving documents from the local store.
   *
   * @param transaction - The transaction this operation is scoped to.
   * @param docs - The documents to apply local mutations to get the local views.
   * @param existenceStateChanged - The set of document keys whose existence state
   *   is changed. This is useful to determine if some documents overlay needs
   *   to be recalculated.
   */
  getLocalViewOfDocuments(e, t, r = q()) {
    const s = Dt();
    return this.populateOverlays(e, s, t).next(() => this.computeViews(e, t, s, r).next((o) => {
      let a = Fn();
      return o.forEach((u, l) => {
        a = a.insert(u, l.overlayedDocument);
      }), a;
    }));
  }
  /**
   * Gets the overlayed documents for the given document map, which will include
   * the local view of those documents and a `FieldMask` indicating which fields
   * are mutated locally, `null` if overlay is a Set or Delete mutation.
   */
  getOverlayedDocuments(e, t) {
    const r = Dt();
    return this.populateOverlays(e, r, t).next(() => this.computeViews(e, t, r, q()));
  }
  /**
   * Fetches the overlays for {@code docs} and adds them to provided overlay map
   * if the map does not already contain an entry for the given document key.
   */
  populateOverlays(e, t, r) {
    const s = [];
    return r.forEach((o) => {
      t.has(o) || s.push(o);
    }), this.documentOverlayCache.getOverlays(e, s).next((o) => {
      o.forEach((a, u) => {
        t.set(a, u);
      });
    });
  }
  /**
   * Computes the local view for the given documents.
   *
   * @param docs - The documents to compute views for. It also has the base
   *   version of the documents.
   * @param overlays - The overlays that need to be applied to the given base
   *   version of the documents.
   * @param existenceStateChanged - A set of documents whose existence states
   *   might have changed. This is used to determine if we need to re-calculate
   *   overlays from mutation queues.
   * @return A map represents the local documents view.
   */
  computeViews(e, t, r, s) {
    let o = Ze();
    const a = Hn(), u = function() {
      return Hn();
    }();
    return t.forEach((l, d) => {
      const p = r.get(d.key);
      s.has(d.key) && (p === void 0 || p.mutation instanceof Rt) ? o = o.insert(d.key, d) : p !== void 0 ? (a.set(d.key, p.mutation.getFieldMask()), Wn(p.mutation, d, p.mutation.getFieldMask(), ie.now())) : (
        // no overlay exists
        // Using EMPTY to indicate there is no overlay for the document.
        a.set(d.key, Pe.empty())
      );
    }), this.recalculateAndSaveOverlays(e, o).next((l) => (l.forEach((d, p) => a.set(d, p)), t.forEach((d, p) => {
      var y;
      return u.set(d, new H_(p, (y = a.get(d)) !== null && y !== void 0 ? y : null));
    }), u));
  }
  recalculateAndSaveOverlays(e, t) {
    const r = Hn();
    let s = new Y((a, u) => a - u), o = q();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next((a) => {
      for (const u of a) u.keys().forEach((l) => {
        const d = t.get(l);
        if (d === null) return;
        let p = r.get(l) || Pe.empty();
        p = u.applyToLocalView(d, p), r.set(l, p);
        const y = (s.get(u.batchId) || q()).add(l);
        s = s.insert(u.batchId, y);
      });
    }).next(() => {
      const a = [], u = s.getReverseIterator();
      for (; u.hasNext(); ) {
        const l = u.getNext(), d = l.key, p = l.value, y = Ll();
        p.forEach((w) => {
          if (!o.has(w)) {
            const P = jl(t.get(w), r.get(w));
            P !== null && y.set(w, P), o = o.add(w);
          }
        }), a.push(this.documentOverlayCache.saveOverlays(e, d, y));
      }
      return S.waitFor(a);
    }).next(() => r);
  }
  /**
   * Recalculates overlays by reading the documents from remote document cache
   * first, and saves them after they are calculated.
   */
  recalculateAndSaveOverlaysForDocumentKeys(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((r) => this.recalculateAndSaveOverlays(e, r));
  }
  /**
   * Performs a query against the local view of all documents.
   *
   * @param transaction - The persistence transaction.
   * @param query - The query to match documents against.
   * @param offset - Read time and key to start scanning by (exclusive).
   * @param context - A optional tracker to keep a record of important details
   *   during database local query execution.
   */
  getDocumentsMatchingQuery(e, t, r, s) {
    return function(a) {
      return L.isDocumentKey(a.path) && a.collectionGroup === null && a.filters.length === 0;
    }(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : Qg(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, r, s) : this.getDocumentsMatchingCollectionQuery(e, t, r, s);
  }
  /**
   * Given a collection group, returns the next documents that follow the provided offset, along
   * with an updated batch ID.
   *
   * <p>The documents returned by this method are ordered by remote version from the provided
   * offset. If there are no more remote documents after the provided offset, documents with
   * mutations in order of batch id from the offset are returned. Since all documents in a batch are
   * returned together, the total number of documents returned can exceed {@code count}.
   *
   * @param transaction
   * @param collectionGroup The collection group for the documents.
   * @param offset The offset to index into.
   * @param count The number of documents to return
   * @return A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
   */
  getNextDocuments(e, t, r, s) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, r, s).next((o) => {
      const a = s - o.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, r.largestBatchId, s - o.size) : S.resolve(Dt());
      let u = Xn, l = o;
      return a.next((d) => S.forEach(d, (p, y) => (u < y.largestBatchId && (u = y.largestBatchId), o.get(p) ? S.resolve() : this.remoteDocumentCache.getEntry(e, p).next((w) => {
        l = l.insert(p, w);
      }))).next(() => this.populateOverlays(e, d, o)).next(() => this.computeViews(e, l, d, q())).next((p) => ({
        batchId: u,
        changes: Ol(p)
      })));
    });
  }
  getDocumentsMatchingDocumentQuery(e, t) {
    return this.getDocument(e, new L(t)).next((r) => {
      let s = Fn();
      return r.isFoundDocument() && (s = s.insert(r.key, r)), s;
    });
  }
  getDocumentsMatchingCollectionGroupQuery(e, t, r, s) {
    const o = t.collectionGroup;
    let a = Fn();
    return this.indexManager.getCollectionParents(e, o).next((u) => S.forEach(u, (l) => {
      const d = function(y, w) {
        return new Ss(
          w,
          /*collectionGroup=*/
          null,
          y.explicitOrderBy.slice(),
          y.filters.slice(),
          y.limit,
          y.limitType,
          y.startAt,
          y.endAt
        );
      }(t, l.child(o));
      return this.getDocumentsMatchingCollectionQuery(e, d, r, s).next((p) => {
        p.forEach((y, w) => {
          a = a.insert(y, w);
        });
      });
    }).next(() => a));
  }
  getDocumentsMatchingCollectionQuery(e, t, r, s) {
    let o;
    return this.documentOverlayCache.getOverlaysForCollection(e, t.path, r.largestBatchId).next((a) => (o = a, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, r, o, s))).next((a) => {
      o.forEach((l, d) => {
        const p = d.getKey();
        a.get(p) === null && (a = a.insert(p, ve.newInvalidDocument(p)));
      });
      let u = Fn();
      return a.forEach((l, d) => {
        const p = o.get(l);
        p !== void 0 && Wn(p.mutation, d, Pe.empty(), ie.now()), // Finally, insert the documents that still match the query
        Cs(t, d) && (u = u.insert(l, d));
      }), u;
    });
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class K_ {
  constructor(e) {
    this.serializer = e, this.dr = /* @__PURE__ */ new Map(), this.Ar = /* @__PURE__ */ new Map();
  }
  getBundleMetadata(e, t) {
    return S.resolve(this.dr.get(t));
  }
  saveBundleMetadata(e, t) {
    return this.dr.set(
      t.id,
      /** Decodes a BundleMetadata proto into a BundleMetadata object. */
      function(s) {
        return {
          id: s.id,
          version: s.version,
          createTime: Fe(s.createTime)
        };
      }(t)
    ), S.resolve();
  }
  getNamedQuery(e, t) {
    return S.resolve(this.Ar.get(t));
  }
  saveNamedQuery(e, t) {
    return this.Ar.set(t.name, function(s) {
      return {
        name: s.name,
        query: M_(s.bundledQuery),
        readTime: Fe(s.readTime)
      };
    }(t)), S.resolve();
  }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class G_ {
  constructor() {
    this.overlays = new Y(L.comparator), this.Rr = /* @__PURE__ */ new Map();
  }
  getOverlay(e, t) {
    return S.resolve(this.overlays.get(t));
  }
  getOverlays(e, t) {
    const r = Dt();
    return S.forEach(t, (s) => this.getOverlay(e, s).next((o) => {
      o !== null && r.set(s, o);
    })).next(() => r);
  }
  saveOverlays(e, t, r) {
    return r.forEach((s, o) => {
      this.Et(e, t, o);
    }), S.resolve();
  }
  removeOverlaysForBatchId(e, t, r) {
    const s = this.Rr.get(r);
    return s !== void 0 && (s.forEach((o) => this.overlays = this.overlays.remove(o)), this.Rr.delete(r)), S.resolve();
  }
  getOverlaysForCollection(e, t, r) {
    const s = Dt(), o = t.length + 1, a = new L(t.child("")), u = this.overlays.getIteratorFrom(a);
    for (; u.hasNext(); ) {
      const l = u.getNext().value, d = l.getKey();
      if (!t.isPrefixOf(d.path)) break;
      d.path.length === o && l.largestBatchId > r && s.set(l.getKey(), l);
    }
    return S.resolve(s);
  }
  getOverlaysForCollectionGroup(e, t, r, s) {
    let o = new Y((d, p) => d - p);
    const a = this.overlays.getIterator();
    for (; a.hasNext(); ) {
      const d = a.getNext().value;
      if (d.getKey().getCollectionGroup() === t && d.largestBatchId > r) {
        let p = o.get(d.largestBatchId);
        p === null && (p = Dt(), o = o.insert(d.largestBatchId, p)), p.set(d.getKey(), d);
      }
    }
    const u = Dt(), l = o.getIterator();
    for (; l.hasNext() && (l.getNext().value.forEach((d, p) => u.set(d, p)), !(u.size() >= s)); )
      ;
    return S.resolve(u);
  }
  Et(e, t, r) {
    const s = this.overlays.get(r.key);
    if (s !== null) {
      const a = this.Rr.get(s.largestBatchId).delete(r.key);
      this.Rr.set(s.largestBatchId, a);
    }
    this.overlays = this.overlays.insert(r.key, new f_(t, r));
    let o = this.Rr.get(t);
    o === void 0 && (o = q(), this.Rr.set(t, o)), this.Rr.set(t, o.add(r.key));
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Q_ {
  constructor() {
    this.sessionToken = de.EMPTY_BYTE_STRING;
  }
  getSessionToken(e) {
    return S.resolve(this.sessionToken);
  }
  setSessionToken(e, t) {
    return this.sessionToken = t, S.resolve();
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class go {
  constructor() {
    this.Vr = new oe(ae.mr), // A set of outstanding references to a document sorted by target id.
    this.gr = new oe(ae.pr);
  }
  /** Returns true if the reference set contains no references. */
  isEmpty() {
    return this.Vr.isEmpty();
  }
  /** Adds a reference to the given document key for the given ID. */
  addReference(e, t) {
    const r = new ae(e, t);
    this.Vr = this.Vr.add(r), this.gr = this.gr.add(r);
  }
  /** Add references to the given document keys for the given ID. */
  yr(e, t) {
    e.forEach((r) => this.addReference(r, t));
  }
  /**
   * Removes a reference to the given document key for the given
   * ID.
   */
  removeReference(e, t) {
    this.wr(new ae(e, t));
  }
  Sr(e, t) {
    e.forEach((r) => this.removeReference(r, t));
  }
  /**
   * Clears all references with a given ID. Calls removeRef() for each key
   * removed.
   */
  br(e) {
    const t = new L(new X([])), r = new ae(t, e), s = new ae(t, e + 1), o = [];
    return this.gr.forEachInRange([r, s], (a) => {
      this.wr(a), o.push(a.key);
    }), o;
  }
  Dr() {
    this.Vr.forEach((e) => this.wr(e));
  }
  wr(e) {
    this.Vr = this.Vr.delete(e), this.gr = this.gr.delete(e);
  }
  vr(e) {
    const t = new L(new X([])), r = new ae(t, e), s = new ae(t, e + 1);
    let o = q();
    return this.gr.forEachInRange([r, s], (a) => {
      o = o.add(a.key);
    }), o;
  }
  containsKey(e) {
    const t = new ae(e, 0), r = this.Vr.firstAfterOrEqual(t);
    return r !== null && e.isEqual(r.key);
  }
}
class ae {
  constructor(e, t) {
    this.key = e, this.Cr = t;
  }
  /** Compare by key then by ID */
  static mr(e, t) {
    return L.comparator(e.key, t.key) || B(e.Cr, t.Cr);
  }
  /** Compare by ID then by key */
  static pr(e, t) {
    return B(e.Cr, t.Cr) || L.comparator(e.key, t.key);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class J_ {
  constructor(e, t) {
    this.indexManager = e, this.referenceDelegate = t, /**
     * The set of all mutations that have been sent but not yet been applied to
     * the backend.
     */
    this.mutationQueue = [], /** Next value to use when assigning sequential IDs to each mutation batch. */
    this.Fr = 1, /** An ordered mapping between documents and the mutations batch IDs. */
    this.Mr = new oe(ae.mr);
  }
  checkEmpty(e) {
    return S.resolve(this.mutationQueue.length === 0);
  }
  addMutationBatch(e, t, r, s) {
    const o = this.Fr;
    this.Fr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const a = new d_(o, t, r, s);
    this.mutationQueue.push(a);
    for (const u of s) this.Mr = this.Mr.add(new ae(u.key, o)), this.indexManager.addToCollectionParentIndex(e, u.key.path.popLast());
    return S.resolve(a);
  }
  lookupMutationBatch(e, t) {
    return S.resolve(this.Or(t));
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const r = t + 1, s = this.Nr(r), o = s < 0 ? 0 : s;
    return S.resolve(this.mutationQueue.length > o ? this.mutationQueue[o] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return S.resolve(this.mutationQueue.length === 0 ? so : this.Fr - 1);
  }
  getAllMutationBatches(e) {
    return S.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const r = new ae(t, 0), s = new ae(t, Number.POSITIVE_INFINITY), o = [];
    return this.Mr.forEachInRange([r, s], (a) => {
      const u = this.Or(a.Cr);
      o.push(u);
    }), S.resolve(o);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let r = new oe(B);
    return t.forEach((s) => {
      const o = new ae(s, 0), a = new ae(s, Number.POSITIVE_INFINITY);
      this.Mr.forEachInRange([o, a], (u) => {
        r = r.add(u.Cr);
      });
    }), S.resolve(this.Br(r));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const r = t.path, s = r.length + 1;
    let o = r;
    L.isDocumentKey(o) || (o = o.child(""));
    const a = new ae(new L(o), 0);
    let u = new oe(B);
    return this.Mr.forEachWhile((l) => {
      const d = l.key.path;
      return !!r.isPrefixOf(d) && // Rows with document keys more than one segment longer than the query
      // path can't be matches. For example, a query on 'rooms' can't match
      // the document /rooms/abc/messages/xyx.
      // TODO(mcg): we'll need a different scanner when we implement
      // ancestor queries.
      (d.length === s && (u = u.add(l.Cr)), !0);
    }, a), S.resolve(this.Br(u));
  }
  Br(e) {
    const t = [];
    return e.forEach((r) => {
      const s = this.Or(r);
      s !== null && t.push(s);
    }), t;
  }
  removeMutationBatch(e, t) {
    G(this.Lr(t.batchId, "removed") === 0), this.mutationQueue.shift();
    let r = this.Mr;
    return S.forEach(t.mutations, (s) => {
      const o = new ae(s.key, t.batchId);
      return r = r.delete(o), this.referenceDelegate.markPotentiallyOrphaned(e, s.key);
    }).next(() => {
      this.Mr = r;
    });
  }
  qn(e) {
  }
  containsKey(e, t) {
    const r = new ae(t, 0), s = this.Mr.firstAfterOrEqual(r);
    return S.resolve(t.isEqual(s && s.key));
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, S.resolve();
  }
  /**
   * Finds the index of the given batchId in the mutation queue and asserts that
   * the resulting index is within the bounds of the queue.
   *
   * @param batchId - The batchId to search for
   * @param action - A description of what the caller is doing, phrased in passive
   * form (e.g. "acknowledged" in a routine that acknowledges batches).
   */
  Lr(e, t) {
    return this.Nr(e);
  }
  /**
   * Finds the index of the given batchId in the mutation queue. This operation
   * is O(1).
   *
   * @returns The computed index of the batch with the given batchId, based on
   * the state of the queue. Note this index can be negative if the requested
   * batchId has already been removed from the queue or past the end of the
   * queue if the batchId is larger than the last added batch.
   */
  Nr(e) {
    return this.mutationQueue.length === 0 ? 0 : e - this.mutationQueue[0].batchId;
  }
  /**
   * A version of lookupMutationBatch that doesn't return a promise, this makes
   * other functions that uses this code easier to read and more efficient.
   */
  Or(e) {
    const t = this.Nr(e);
    return t < 0 || t >= this.mutationQueue.length ? null : this.mutationQueue[t];
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class X_ {
  /**
   * @param sizer - Used to assess the size of a document. For eager GC, this is
   * expected to just return 0 to avoid unnecessarily doing the work of
   * calculating the size.
   */
  constructor(e) {
    this.kr = e, /** Underlying cache of documents and their read times. */
    this.docs = function() {
      return new Y(L.comparator);
    }(), /** Size of all cached documents. */
    this.size = 0;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  /**
   * Adds the supplied entry to the cache and updates the cache size as appropriate.
   *
   * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  addEntry(e, t) {
    const r = t.key, s = this.docs.get(r), o = s ? s.size : 0, a = this.kr(t);
    return this.docs = this.docs.insert(r, {
      document: t.mutableCopy(),
      size: a
    }), this.size += a - o, this.indexManager.addToCollectionParentIndex(e, r.path.popLast());
  }
  /**
   * Removes the specified entry from the cache and updates the cache size as appropriate.
   *
   * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  removeEntry(e) {
    const t = this.docs.get(e);
    t && (this.docs = this.docs.remove(e), this.size -= t.size);
  }
  getEntry(e, t) {
    const r = this.docs.get(t);
    return S.resolve(r ? r.document.mutableCopy() : ve.newInvalidDocument(t));
  }
  getEntries(e, t) {
    let r = Ze();
    return t.forEach((s) => {
      const o = this.docs.get(s);
      r = r.insert(s, o ? o.document.mutableCopy() : ve.newInvalidDocument(s));
    }), S.resolve(r);
  }
  getDocumentsMatchingQuery(e, t, r, s) {
    let o = Ze();
    const a = t.path, u = new L(a.child("__id-9223372036854775808__")), l = this.docs.getIteratorFrom(u);
    for (; l.hasNext(); ) {
      const { key: d, value: { document: p } } = l.getNext();
      if (!a.isPrefixOf(d.path)) break;
      d.path.length > a.length + 1 || Sg(Rg(p), r) <= 0 || (s.has(p.key) || Cs(t, p)) && (o = o.insert(p.key, p.mutableCopy()));
    }
    return S.resolve(o);
  }
  getAllFromCollectionGroup(e, t, r, s) {
    x();
  }
  qr(e, t) {
    return S.forEach(this.docs, (r) => t(r));
  }
  newChangeBuffer(e) {
    return new Y_(this);
  }
  getSize(e) {
    return S.resolve(this.size);
  }
}
class Y_ extends z_ {
  constructor(e) {
    super(), this.Ir = e;
  }
  applyChanges(e) {
    const t = [];
    return this.changes.forEach((r, s) => {
      s.isValidDocument() ? t.push(this.Ir.addEntry(e, s)) : this.Ir.removeEntry(r);
    }), S.waitFor(t);
  }
  getFromCache(e, t) {
    return this.Ir.getEntry(e, t);
  }
  getAllFromCache(e, t) {
    return this.Ir.getEntries(e, t);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Z_ {
  constructor(e) {
    this.persistence = e, /**
     * Maps a target to the data about that target
     */
    this.Qr = new Ft((t) => ao(t), co), /** The last received snapshot version. */
    this.lastRemoteSnapshotVersion = U.min(), /** The highest numbered target ID encountered. */
    this.highestTargetId = 0, /** The highest sequence number encountered. */
    this.$r = 0, /**
     * A ordered bidirectional mapping between documents and the remote target
     * IDs.
     */
    this.Ur = new go(), this.targetCount = 0, this.Kr = an.Un();
  }
  forEachTarget(e, t) {
    return this.Qr.forEach((r, s) => t(s)), S.resolve();
  }
  getLastRemoteSnapshotVersion(e) {
    return S.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return S.resolve(this.$r);
  }
  allocateTargetId(e) {
    return this.highestTargetId = this.Kr.next(), S.resolve(this.highestTargetId);
  }
  setTargetsMetadata(e, t, r) {
    return r && (this.lastRemoteSnapshotVersion = r), t > this.$r && (this.$r = t), S.resolve();
  }
  zn(e) {
    this.Qr.set(e.target, e);
    const t = e.targetId;
    t > this.highestTargetId && (this.Kr = new an(t), this.highestTargetId = t), e.sequenceNumber > this.$r && (this.$r = e.sequenceNumber);
  }
  addTargetData(e, t) {
    return this.zn(t), this.targetCount += 1, S.resolve();
  }
  updateTargetData(e, t) {
    return this.zn(t), S.resolve();
  }
  removeTargetData(e, t) {
    return this.Qr.delete(t.target), this.Ur.br(t.targetId), this.targetCount -= 1, S.resolve();
  }
  removeTargets(e, t, r) {
    let s = 0;
    const o = [];
    return this.Qr.forEach((a, u) => {
      u.sequenceNumber <= t && r.get(u.targetId) === null && (this.Qr.delete(a), o.push(this.removeMatchingKeysForTargetId(e, u.targetId)), s++);
    }), S.waitFor(o).next(() => s);
  }
  getTargetCount(e) {
    return S.resolve(this.targetCount);
  }
  getTargetData(e, t) {
    const r = this.Qr.get(t) || null;
    return S.resolve(r);
  }
  addMatchingKeys(e, t, r) {
    return this.Ur.yr(t, r), S.resolve();
  }
  removeMatchingKeys(e, t, r) {
    this.Ur.Sr(t, r);
    const s = this.persistence.referenceDelegate, o = [];
    return s && t.forEach((a) => {
      o.push(s.markPotentiallyOrphaned(e, a));
    }), S.waitFor(o);
  }
  removeMatchingKeysForTargetId(e, t) {
    return this.Ur.br(t), S.resolve();
  }
  getMatchingKeysForTargetId(e, t) {
    const r = this.Ur.vr(t);
    return S.resolve(r);
  }
  containsKey(e, t) {
    return S.resolve(this.Ur.containsKey(t));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class eh {
  /**
   * The constructor accepts a factory for creating a reference delegate. This
   * allows both the delegate and this instance to have strong references to
   * each other without having nullable fields that would then need to be
   * checked or asserted on every access.
   */
  constructor(e, t) {
    this.Wr = {}, this.overlays = {}, this.Gr = new ws(0), this.zr = !1, this.zr = !0, this.jr = new Q_(), this.referenceDelegate = e(this), this.Hr = new Z_(this), this.indexManager = new x_(), this.remoteDocumentCache = function(s) {
      return new X_(s);
    }((r) => this.referenceDelegate.Jr(r)), this.serializer = new L_(t), this.Yr = new K_(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.zr = !1, Promise.resolve();
  }
  get started() {
    return this.zr;
  }
  setDatabaseDeletedListener() {
  }
  setNetworkEnabled() {
  }
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t = this.overlays[e.toKey()];
    return t || (t = new G_(), this.overlays[e.toKey()] = t), t;
  }
  getMutationQueue(e, t) {
    let r = this.Wr[e.toKey()];
    return r || (r = new J_(t, this.referenceDelegate), this.Wr[e.toKey()] = r), r;
  }
  getGlobalsCache() {
    return this.jr;
  }
  getTargetCache() {
    return this.Hr;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.Yr;
  }
  runTransaction(e, t, r) {
    D("MemoryPersistence", "Starting transaction:", e);
    const s = new ey(this.Gr.next());
    return this.referenceDelegate.Zr(), r(s).next((o) => this.referenceDelegate.Xr(s).next(() => o)).toPromise().then((o) => (s.raiseOnCommittedEvent(), o));
  }
  ei(e, t) {
    return S.or(Object.values(this.Wr).map((r) => () => r.containsKey(e, t)));
  }
}
class ey extends Cg {
  constructor(e) {
    super(), this.currentSequenceNumber = e;
  }
}
class _o {
  constructor(e) {
    this.persistence = e, /** Tracks all documents that are active in Query views. */
    this.ti = new go(), /** The list of documents that are potentially GCed after each transaction. */
    this.ni = null;
  }
  static ri(e) {
    return new _o(e);
  }
  get ii() {
    if (this.ni) return this.ni;
    throw x();
  }
  addReference(e, t, r) {
    return this.ti.addReference(r, t), this.ii.delete(r.toString()), S.resolve();
  }
  removeReference(e, t, r) {
    return this.ti.removeReference(r, t), this.ii.add(r.toString()), S.resolve();
  }
  markPotentiallyOrphaned(e, t) {
    return this.ii.add(t.toString()), S.resolve();
  }
  removeTarget(e, t) {
    this.ti.br(t.targetId).forEach((s) => this.ii.add(s.toString()));
    const r = this.persistence.getTargetCache();
    return r.getMatchingKeysForTargetId(e, t.targetId).next((s) => {
      s.forEach((o) => this.ii.add(o.toString()));
    }).next(() => r.removeTargetData(e, t));
  }
  Zr() {
    this.ni = /* @__PURE__ */ new Set();
  }
  Xr(e) {
    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return S.forEach(this.ii, (r) => {
      const s = L.fromPath(r);
      return this.si(e, s).next((o) => {
        o || t.removeEntry(s, U.min());
      });
    }).next(() => (this.ni = null, t.apply(e)));
  }
  updateLimboDocument(e, t) {
    return this.si(e, t).next((r) => {
      r ? this.ii.delete(t.toString()) : this.ii.add(t.toString());
    });
  }
  Jr(e) {
    return 0;
  }
  si(e, t) {
    return S.or([() => S.resolve(this.ti.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.ei(e, t)]);
  }
}
class ds {
  constructor(e, t) {
    this.persistence = e, this.oi = new Ft((r) => Vg(r.path), (r, s) => r.isEqual(s)), this.garbageCollector = $_(this, t);
  }
  static ri(e, t) {
    return new ds(e, t);
  }
  // No-ops, present so memory persistence doesn't have to care which delegate
  // it has.
  Zr() {
  }
  Xr(e) {
    return S.resolve();
  }
  forEachTarget(e, t) {
    return this.persistence.getTargetCache().forEachTarget(e, t);
  }
  nr(e) {
    const t = this.sr(e);
    return this.persistence.getTargetCache().getTargetCount(e).next((r) => t.next((s) => r + s));
  }
  sr(e) {
    let t = 0;
    return this.rr(e, (r) => {
      t++;
    }).next(() => t);
  }
  rr(e, t) {
    return S.forEach(this.oi, (r, s) => this.ar(e, r, s).next((o) => o ? S.resolve() : t(s)));
  }
  removeTargets(e, t, r) {
    return this.persistence.getTargetCache().removeTargets(e, t, r);
  }
  removeOrphanedDocuments(e, t) {
    let r = 0;
    const s = this.persistence.getRemoteDocumentCache(), o = s.newChangeBuffer();
    return s.qr(e, (a) => this.ar(e, a, t).next((u) => {
      u || (r++, o.removeEntry(a, U.min()));
    })).next(() => o.apply(e)).next(() => r);
  }
  markPotentiallyOrphaned(e, t) {
    return this.oi.set(t, e.currentSequenceNumber), S.resolve();
  }
  removeTarget(e, t) {
    const r = t.withSequenceNumber(e.currentSequenceNumber);
    return this.persistence.getTargetCache().updateTargetData(e, r);
  }
  addReference(e, t, r) {
    return this.oi.set(r, e.currentSequenceNumber), S.resolve();
  }
  removeReference(e, t, r) {
    return this.oi.set(r, e.currentSequenceNumber), S.resolve();
  }
  updateLimboDocument(e, t) {
    return this.oi.set(t, e.currentSequenceNumber), S.resolve();
  }
  Jr(e) {
    let t = e.key.toString().length;
    return e.isFoundDocument() && (t += Hr(e.data.value)), t;
  }
  ar(e, t, r) {
    return S.or([() => this.persistence.ei(e, t), () => this.persistence.getTargetCache().containsKey(e, t), () => {
      const s = this.oi.get(t);
      return S.resolve(s !== void 0 && s > r);
    }]);
  }
  getCacheSize(e) {
    return this.persistence.getRemoteDocumentCache().getSize(e);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class yo {
  constructor(e, t, r, s) {
    this.targetId = e, this.fromCache = t, this.Hi = r, this.Ji = s;
  }
  static Yi(e, t) {
    let r = q(), s = q();
    for (const o of t.docChanges) switch (o.type) {
      case 0:
        r = r.add(o.doc.key);
        break;
      case 1:
        s = s.add(o.doc.key);
    }
    return new yo(e, t.fromCache, r, s);
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ty {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ny {
  constructor() {
    this.Zi = !1, this.Xi = !1, /**
     * SDK only decides whether it should create index when collection size is
     * larger than this.
     */
    this.es = 100, this.ts = /**
    * This cost represents the evaluation result of
    * (([index, docKey] + [docKey, docContent]) per document in the result set)
    * / ([docKey, docContent] per documents in full collection scan) coming from
    * experiment [enter PR experiment URL here].
    */
    function() {
      return xd() ? 8 : bg(Ee()) > 0 ? 6 : 4;
    }();
  }
  /** Sets the document view to query against. */
  initialize(e, t) {
    this.ns = e, this.indexManager = t, this.Zi = !0;
  }
  /** Returns all local documents matching the specified query. */
  getDocumentsMatchingQuery(e, t, r, s) {
    const o = {
      result: null
    };
    return this.rs(e, t).next((a) => {
      o.result = a;
    }).next(() => {
      if (!o.result) return this.ss(e, t, s, r).next((a) => {
        o.result = a;
      });
    }).next(() => {
      if (o.result) return;
      const a = new ty();
      return this._s(e, t, a).next((u) => {
        if (o.result = u, this.Xi) return this.us(e, t, a, u.size);
      });
    }).next(() => o.result);
  }
  us(e, t, r, s) {
    return r.documentReadCount < this.es ? (Ht() <= j.DEBUG && D("QueryEngine", "SDK will not create cache indexes for query:", Wt(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.es, "documents"), S.resolve()) : (Ht() <= j.DEBUG && D("QueryEngine", "Query:", Wt(t), "scans", r.documentReadCount, "local documents and returns", s, "documents as results."), r.documentReadCount > this.ts * s ? (Ht() <= j.DEBUG && D("QueryEngine", "The SDK decides to create cache indexes for query:", Wt(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, Ue(t))) : S.resolve());
  }
  /**
   * Performs an indexed query that evaluates the query based on a collection's
   * persisted index values. Returns `null` if an index is not available.
   */
  rs(e, t) {
    if (Mc(t))
      return S.resolve(null);
    let r = Ue(t);
    return this.indexManager.getIndexType(e, r).next((s) => s === 0 ? null : (t.limit !== null && s === 1 && // We cannot apply a limit for targets that are served using a partial
    // index. If a partial index will be used to serve the target, the
    // query may return a superset of documents that match the target
    // (e.g. if the index doesn't include all the target's filters), or
    // may return the correct set of documents in the wrong order (e.g. if
    // the index doesn't include a segment for one of the orderBys).
    // Therefore, a limit should not be applied in such cases.
    (t = Oi(
      t,
      null,
      "F"
      /* LimitType.First */
    ), r = Ue(t)), this.indexManager.getDocumentsMatchingTarget(e, r).next((o) => {
      const a = q(...o);
      return this.ns.getDocuments(e, a).next((u) => this.indexManager.getMinOffset(e, r).next((l) => {
        const d = this.cs(t, u);
        return this.ls(t, d, a, l.readTime) ? this.rs(e, Oi(
          t,
          null,
          "F"
          /* LimitType.First */
        )) : this.hs(e, d, t, l);
      }));
    })));
  }
  /**
   * Performs a query based on the target's persisted query mapping. Returns
   * `null` if the mapping is not available or cannot be used.
   */
  ss(e, t, r, s) {
    return Mc(t) || s.isEqual(U.min()) ? S.resolve(null) : this.ns.getDocuments(e, r).next((o) => {
      const a = this.cs(t, o);
      return this.ls(t, a, r, s) ? S.resolve(null) : (Ht() <= j.DEBUG && D("QueryEngine", "Re-using previous result from %s to execute query: %s", s.toString(), Wt(t)), this.hs(e, a, t, Ag(s, Xn)).next((u) => u));
    });
  }
  /** Applies the query filter and sorting to the provided documents.  */
  cs(e, t) {
    let r = new oe(Dl(e));
    return t.forEach((s, o) => {
      Cs(e, o) && (r = r.add(o));
    }), r;
  }
  /**
   * Determines if a limit query needs to be refilled from cache, making it
   * ineligible for index-free execution.
   *
   * @param query - The query.
   * @param sortedPreviousResults - The documents that matched the query when it
   * was last synchronized, sorted by the query's comparator.
   * @param remoteKeys - The document keys that matched the query at the last
   * snapshot.
   * @param limboFreeSnapshotVersion - The version of the snapshot when the
   * query was last synchronized.
   */
  ls(e, t, r, s) {
    if (e.limit === null)
      return !1;
    if (r.size !== t.size)
      return !0;
    const o = e.limitType === "F" ? t.last() : t.first();
    return !!o && (o.hasPendingWrites || o.version.compareTo(s) > 0);
  }
  _s(e, t, r) {
    return Ht() <= j.DEBUG && D("QueryEngine", "Using full collection scan to execute query:", Wt(t)), this.ns.getDocumentsMatchingQuery(e, t, _t.min(), r);
  }
  /**
   * Combines the results from an indexed execution with the remaining documents
   * that have not yet been indexed.
   */
  hs(e, t, r, s) {
    return this.ns.getDocumentsMatchingQuery(e, r, s).next((o) => (
      // Merge with existing results
      (t.forEach((a) => {
        o = o.insert(a.key, a);
      }), o)
    ));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const vo = "LocalStore", ry = 3e8;
class sy {
  constructor(e, t, r, s) {
    this.persistence = e, this.Ps = t, this.serializer = s, /**
     * Maps a targetID to data about its target.
     *
     * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
     * of `applyRemoteEvent()` idempotent.
     */
    this.Ts = new Y(B), /** Maps a target to its targetID. */
    // TODO(wuandy): Evaluate if TargetId can be part of Target.
    this.Is = new Ft((o) => ao(o), co), /**
     * A per collection group index of the last read time processed by
     * `getNewDocumentChanges()`.
     *
     * PORTING NOTE: This is only used for multi-tab synchronization.
     */
    this.Es = /* @__PURE__ */ new Map(), this.ds = e.getRemoteDocumentCache(), this.Hr = e.getTargetCache(), this.Yr = e.getBundleCache(), this.As(r);
  }
  As(e) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new W_(this.ds, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.ds.setIndexManager(this.indexManager), this.Ps.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(e) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t) => e.collect(t, this.Ts));
  }
}
function iy(n, e, t, r) {
  return new sy(n, e, t, r);
}
async function th(n, e) {
  const t = F(n);
  return await t.persistence.runTransaction("Handle user change", "readonly", (r) => {
    let s;
    return t.mutationQueue.getAllMutationBatches(r).next((o) => (s = o, t.As(e), t.mutationQueue.getAllMutationBatches(r))).next((o) => {
      const a = [], u = [];
      let l = q();
      for (const d of s) {
        a.push(d.batchId);
        for (const p of d.mutations) l = l.add(p.key);
      }
      for (const d of o) {
        u.push(d.batchId);
        for (const p of d.mutations) l = l.add(p.key);
      }
      return t.localDocuments.getDocuments(r, l).next((d) => ({
        Rs: d,
        removedBatchIds: a,
        addedBatchIds: u
      }));
    });
  });
}
function oy(n, e) {
  const t = F(n);
  return t.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (r) => {
    const s = e.batch.keys(), o = t.ds.newChangeBuffer({
      trackRemovals: !0
    });
    return function(u, l, d, p) {
      const y = d.batch, w = y.keys();
      let P = S.resolve();
      return w.forEach((k) => {
        P = P.next(() => p.getEntry(l, k)).next((N) => {
          const V = d.docVersions.get(k);
          G(V !== null), N.version.compareTo(V) < 0 && (y.applyToRemoteDocument(N, d), N.isValidDocument() && // We use the commitVersion as the readTime rather than the
          // document's updateTime since the updateTime is not advanced
          // for updates that do not modify the underlying document.
          (N.setReadTime(d.commitVersion), p.addEntry(N)));
        });
      }), P.next(() => u.mutationQueue.removeMutationBatch(l, y));
    }(t, r, e, o).next(() => o.apply(r)).next(() => t.mutationQueue.performConsistencyCheck(r)).next(() => t.documentOverlayCache.removeOverlaysForBatchId(r, s, e.batch.batchId)).next(() => t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r, function(u) {
      let l = q();
      for (let d = 0; d < u.mutationResults.length; ++d)
        u.mutationResults[d].transformResults.length > 0 && (l = l.add(u.batch.mutations[d].key));
      return l;
    }(e))).next(() => t.localDocuments.getDocuments(r, s));
  });
}
function nh(n) {
  const e = F(n);
  return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t) => e.Hr.getLastRemoteSnapshotVersion(t));
}
function ay(n, e) {
  const t = F(n), r = e.snapshotVersion;
  let s = t.Ts;
  return t.persistence.runTransaction("Apply remote event", "readwrite-primary", (o) => {
    const a = t.ds.newChangeBuffer({
      trackRemovals: !0
    });
    s = t.Ts;
    const u = [];
    e.targetChanges.forEach((p, y) => {
      const w = s.get(y);
      if (!w) return;
      u.push(t.Hr.removeMatchingKeys(o, p.removedDocuments, y).next(() => t.Hr.addMatchingKeys(o, p.addedDocuments, y)));
      let P = w.withSequenceNumber(o.currentSequenceNumber);
      e.targetMismatches.get(y) !== null ? P = P.withResumeToken(de.EMPTY_BYTE_STRING, U.min()).withLastLimboFreeSnapshotVersion(U.min()) : p.resumeToken.approximateByteSize() > 0 && (P = P.withResumeToken(p.resumeToken, r)), s = s.insert(y, P), // Update the target data if there are target changes (or if
      // sufficient time has passed since the last update).
      /**
      * Returns true if the newTargetData should be persisted during an update of
      * an active target. TargetData should always be persisted when a target is
      * being released and should not call this function.
      *
      * While the target is active, TargetData updates can be omitted when nothing
      * about the target has changed except metadata like the resume token or
      * snapshot version. Occasionally it's worth the extra write to prevent these
      * values from getting too stale after a crash, but this doesn't have to be
      * too frequent.
      */
      function(N, V, K) {
        return N.resumeToken.approximateByteSize() === 0 || V.snapshotVersion.toMicroseconds() - N.snapshotVersion.toMicroseconds() >= ry ? !0 : K.addedDocuments.size + K.modifiedDocuments.size + K.removedDocuments.size > 0;
      }(w, P, p) && u.push(t.Hr.updateTargetData(o, P));
    });
    let l = Ze(), d = q();
    if (e.documentUpdates.forEach((p) => {
      e.resolvedLimboDocuments.has(p) && u.push(t.persistence.referenceDelegate.updateLimboDocument(o, p));
    }), // Each loop iteration only affects its "own" doc, so it's safe to get all
    // the remote documents in advance in a single call.
    u.push(cy(o, a, e.documentUpdates).next((p) => {
      l = p.Vs, d = p.fs;
    })), !r.isEqual(U.min())) {
      const p = t.Hr.getLastRemoteSnapshotVersion(o).next((y) => t.Hr.setTargetsMetadata(o, o.currentSequenceNumber, r));
      u.push(p);
    }
    return S.waitFor(u).next(() => a.apply(o)).next(() => t.localDocuments.getLocalViewOfDocuments(o, l, d)).next(() => l);
  }).then((o) => (t.Ts = s, o));
}
function cy(n, e, t) {
  let r = q(), s = q();
  return t.forEach((o) => r = r.add(o)), e.getEntries(n, r).next((o) => {
    let a = Ze();
    return t.forEach((u, l) => {
      const d = o.get(u);
      l.isFoundDocument() !== d.isFoundDocument() && (s = s.add(u)), // Note: The order of the steps below is important, since we want
      // to ensure that rejected limbo resolutions (which fabricate
      // NoDocuments with SnapshotVersion.min()) never add documents to
      // cache.
      l.isNoDocument() && l.version.isEqual(U.min()) ? (
        // NoDocuments with SnapshotVersion.min() are used in manufactured
        // events. We remove these documents from cache since we lost
        // access.
        (e.removeEntry(u, l.readTime), a = a.insert(u, l))
      ) : !d.isValidDocument() || l.version.compareTo(d.version) > 0 || l.version.compareTo(d.version) === 0 && d.hasPendingWrites ? (e.addEntry(l), a = a.insert(u, l)) : D(vo, "Ignoring outdated watch update for ", u, ". Current version:", d.version, " Watch version:", l.version);
    }), {
      Vs: a,
      fs: s
    };
  });
}
function uy(n, e) {
  const t = F(n);
  return t.persistence.runTransaction("Get next mutation batch", "readonly", (r) => (e === void 0 && (e = so), t.mutationQueue.getNextMutationBatchAfterBatchId(r, e)));
}
function ly(n, e) {
  const t = F(n);
  return t.persistence.runTransaction("Allocate target", "readwrite", (r) => {
    let s;
    return t.Hr.getTargetData(r, e).next((o) => o ? (
      // This target has been listened to previously, so reuse the
      // previous targetID.
      // TODO(mcg): freshen last accessed date?
      (s = o, S.resolve(s))
    ) : t.Hr.allocateTargetId(r).next((a) => (s = new lt(e, a, "TargetPurposeListen", r.currentSequenceNumber), t.Hr.addTargetData(r, s).next(() => s))));
  }).then((r) => {
    const s = t.Ts.get(r.targetId);
    return (s === null || r.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (t.Ts = t.Ts.insert(r.targetId, r), t.Is.set(e, r.targetId)), r;
  });
}
async function Fi(n, e, t) {
  const r = F(n), s = r.Ts.get(e), o = t ? "readwrite" : "readwrite-primary";
  try {
    t || await r.persistence.runTransaction("Release target", o, (a) => r.persistence.referenceDelegate.removeTarget(a, s));
  } catch (a) {
    if (!gn(a)) throw a;
    D(vo, `Failed to update sequence numbers for target ${e}: ${a}`);
  }
  r.Ts = r.Ts.remove(e), r.Is.delete(s.target);
}
function Qc(n, e, t) {
  const r = F(n);
  let s = U.min(), o = q();
  return r.persistence.runTransaction(
    "Execute query",
    "readwrite",
    // Use readwrite instead of readonly so indexes can be created
    // Use readwrite instead of readonly so indexes can be created
    (a) => function(l, d, p) {
      const y = F(l), w = y.Is.get(p);
      return w !== void 0 ? S.resolve(y.Ts.get(w)) : y.Hr.getTargetData(d, p);
    }(r, a, Ue(e)).next((u) => {
      if (u) return s = u.lastLimboFreeSnapshotVersion, r.Hr.getMatchingKeysForTargetId(a, u.targetId).next((l) => {
        o = l;
      });
    }).next(() => r.Ps.getDocumentsMatchingQuery(a, e, t ? s : U.min(), t ? o : q())).next((u) => (hy(r, Xg(e), u), {
      documents: u,
      gs: o
    }))
  );
}
function hy(n, e, t) {
  let r = n.Es.get(e) || U.min();
  t.forEach((s, o) => {
    o.readTime.compareTo(r) > 0 && (r = o.readTime);
  }), n.Es.set(e, r);
}
class Jc {
  constructor() {
    this.activeTargetIds = r_();
  }
  Ds(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  vs(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  /**
   * Converts this entry into a JSON-encoded format we can use for WebStorage.
   * Does not encode `clientId` as it is part of the key in WebStorage.
   */
  bs() {
    const e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(e);
  }
}
class dy {
  constructor() {
    this.ho = new Jc(), this.Po = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(e) {
  }
  updateMutationState(e, t, r) {
  }
  addLocalQueryTarget(e, t = !0) {
    return t && this.ho.Ds(e), this.Po[e] || "not-current";
  }
  updateQueryState(e, t, r) {
    this.Po[e] = t;
  }
  removeLocalQueryTarget(e) {
    this.ho.vs(e);
  }
  isLocalQueryTarget(e) {
    return this.ho.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.Po[e];
  }
  getAllActiveQueryTargets() {
    return this.ho.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.ho.activeTargetIds.has(e);
  }
  start() {
    return this.ho = new Jc(), Promise.resolve();
  }
  handleUserChange(e, t, r) {
  }
  setOnlineState(e) {
  }
  shutdown() {
  }
  writeSequenceNumber(e) {
  }
  notifyBundleLoaded(e) {
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fy {
  To(e) {
  }
  shutdown() {
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Xc = "ConnectivityMonitor";
class Yc {
  constructor() {
    this.Io = () => this.Eo(), this.Ao = () => this.Ro(), this.Vo = [], this.mo();
  }
  To(e) {
    this.Vo.push(e);
  }
  shutdown() {
    window.removeEventListener("online", this.Io), window.removeEventListener("offline", this.Ao);
  }
  mo() {
    window.addEventListener("online", this.Io), window.addEventListener("offline", this.Ao);
  }
  Eo() {
    D(Xc, "Network connectivity changed: AVAILABLE");
    for (const e of this.Vo) e(
      0
      /* NetworkStatus.AVAILABLE */
    );
  }
  Ro() {
    D(Xc, "Network connectivity changed: UNAVAILABLE");
    for (const e of this.Vo) e(
      1
      /* NetworkStatus.UNAVAILABLE */
    );
  }
  // TODO(chenbrian): Consider passing in window either into this component or
  // here for testing via FakeWindow.
  /** Checks that all used attributes of window are available. */
  static D() {
    return typeof window < "u" && window.addEventListener !== void 0 && window.removeEventListener !== void 0;
  }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let xr = null;
function Bi() {
  return xr === null ? xr = function() {
    return 268435456 + Math.round(2147483648 * Math.random());
  }() : xr++, "0x" + xr.toString(16);
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const yi = "RestConnection", py = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery"
};
class my {
  get fo() {
    return !1;
  }
  constructor(e) {
    this.databaseInfo = e, this.databaseId = e.databaseId;
    const t = e.ssl ? "https" : "http", r = encodeURIComponent(this.databaseId.projectId), s = encodeURIComponent(this.databaseId.database);
    this.po = t + "://" + e.host, this.yo = `projects/${r}/databases/${s}`, this.wo = this.databaseId.database === is ? `project_id=${r}` : `project_id=${r}&database_id=${s}`;
  }
  So(e, t, r, s, o) {
    const a = Bi(), u = this.bo(e, t.toUriEncodedString());
    D(yi, `Sending RPC '${e}' ${a}:`, u, r);
    const l = {
      "google-cloud-resource-prefix": this.yo,
      "x-goog-request-params": this.wo
    };
    return this.Do(l, s, o), this.vo(e, u, l, r).then((d) => (D(yi, `Received RPC '${e}' ${a}: `, d), d), (d) => {
      throw nn(yi, `RPC '${e}' ${a} failed with error: `, d, "url: ", u, "request:", r), d;
    });
  }
  Co(e, t, r, s, o, a) {
    return this.So(e, t, r, s, o);
  }
  /**
   * Modifies the headers for a request, adding any authorization token if
   * present and any additional headers for the request.
   */
  Do(e, t, r) {
    e["X-Goog-Api-Client"] = // SDK_VERSION is updated to different value at runtime depending on the entry point,
    // so we need to get its value when we need it in a function.
    function() {
      return "gl-js/ fire/" + pn;
    }(), // Content-Type: text/plain will avoid preflight requests which might
    // mess with CORS and redirects by proxies. If we add custom headers
    // we will need to change this code to potentially use the $httpOverwrite
    // parameter supported by ESF to avoid triggering preflight requests.
    e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach((s, o) => e[o] = s), r && r.headers.forEach((s, o) => e[o] = s);
  }
  bo(e, t) {
    const r = py[e];
    return `${this.po}/v1/${t}:${r}`;
  }
  /**
   * Closes and cleans up any resources associated with the connection. This
   * implementation is a no-op because there are no resources associated
   * with the RestConnection that need to be cleaned up.
   */
  terminate() {
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class gy {
  constructor(e) {
    this.Fo = e.Fo, this.Mo = e.Mo;
  }
  xo(e) {
    this.Oo = e;
  }
  No(e) {
    this.Bo = e;
  }
  Lo(e) {
    this.ko = e;
  }
  onMessage(e) {
    this.qo = e;
  }
  close() {
    this.Mo();
  }
  send(e) {
    this.Fo(e);
  }
  Qo() {
    this.Oo();
  }
  $o() {
    this.Bo();
  }
  Uo(e) {
    this.ko(e);
  }
  Ko(e) {
    this.qo(e);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _e = "WebChannelConnection";
class _y extends my {
  constructor(e) {
    super(e), this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
  }
  vo(e, t, r, s) {
    const o = Bi();
    return new Promise((a, u) => {
      const l = new al();
      l.setWithCredentials(!0), l.listenOnce(cl.COMPLETE, () => {
        try {
          switch (l.getLastErrorCode()) {
            case zr.NO_ERROR:
              const p = l.getResponseJson();
              D(_e, `XHR for RPC '${e}' ${o} received:`, JSON.stringify(p)), a(p);
              break;
            case zr.TIMEOUT:
              D(_e, `RPC '${e}' ${o} timed out`), u(new O(C.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case zr.HTTP_ERROR:
              const y = l.getStatus();
              if (D(_e, `RPC '${e}' ${o} failed with status:`, y, "response text:", l.getResponseText()), y > 0) {
                let w = l.getResponseJson();
                Array.isArray(w) && (w = w[0]);
                const P = w == null ? void 0 : w.error;
                if (P && P.status && P.message) {
                  const k = function(V) {
                    const K = V.toLowerCase().replace(/_/g, "-");
                    return Object.values(C).indexOf(K) >= 0 ? K : C.UNKNOWN;
                  }(P.status);
                  u(new O(k, P.message));
                } else u(new O(C.UNKNOWN, "Server responded with status " + l.getStatus()));
              } else
                u(new O(C.UNAVAILABLE, "Connection failed."));
              break;
            default:
              x();
          }
        } finally {
          D(_e, `RPC '${e}' ${o} completed.`);
        }
      });
      const d = JSON.stringify(s);
      D(_e, `RPC '${e}' ${o} sending request:`, s), l.send(t, "POST", d, r, 15);
    });
  }
  Wo(e, t, r) {
    const s = Bi(), o = [this.po, "/", "google.firestore.v1.Firestore", "/", e, "/channel"], a = hl(), u = ll(), l = {
      // Required for backend stickiness, routing behavior is based on this
      // parameter.
      httpSessionIdParam: "gsessionid",
      initMessageHeaders: {},
      messageUrlParams: {
        // This param is used to improve routing and project isolation by the
        // backend and must be included in every request.
        database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
      },
      sendRawJson: !0,
      supportsCrossDomainXhr: !0,
      internalChannelParams: {
        // Override the default timeout (randomized between 10-20 seconds) since
        // a large write batch on a slow internet connection may take a long
        // time to send to the backend. Rather than have WebChannel impose a
        // tight timeout which could lead to infinite timeouts and retries, we
        // set it very large (5-10 minutes) and rely on the browser's builtin
        // timeouts to kick in if the request isn't working.
        forwardChannelRequestTimeoutMs: 6e5
      },
      forceLongPolling: this.forceLongPolling,
      detectBufferingProxy: this.autoDetectLongPolling
    }, d = this.longPollingOptions.timeoutSeconds;
    d !== void 0 && (l.longPollingTimeout = Math.round(1e3 * d)), this.useFetchStreams && (l.useFetchStreams = !0), this.Do(l.initMessageHeaders, t, r), // Sending the custom headers we just added to request.initMessageHeaders
    // (Authorization, etc.) will trigger the browser to make a CORS preflight
    // request because the XHR will no longer meet the criteria for a "simple"
    // CORS request:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
    // Therefore to avoid the CORS preflight request (an extra network
    // roundtrip), we use the encodeInitMessageHeaders option to specify that
    // the headers should instead be encoded in the request's POST payload,
    // which is recognized by the webchannel backend.
    l.encodeInitMessageHeaders = !0;
    const p = o.join("");
    D(_e, `Creating RPC '${e}' stream ${s}: ${p}`, l);
    const y = a.createWebChannel(p, l);
    let w = !1, P = !1;
    const k = new gy({
      Fo: (V) => {
        P ? D(_e, `Not sending because RPC '${e}' stream ${s} is closed:`, V) : (w || (D(_e, `Opening RPC '${e}' stream ${s} transport.`), y.open(), w = !0), D(_e, `RPC '${e}' stream ${s} sending:`, V), y.send(V));
      },
      Mo: () => y.close()
    }), N = (V, K, z) => {
      V.listen(K, (H) => {
        try {
          z(H);
        } catch (ee) {
          setTimeout(() => {
            throw ee;
          }, 0);
        }
      });
    };
    return N(y, Un.EventType.OPEN, () => {
      P || (D(_e, `RPC '${e}' stream ${s} transport opened.`), k.Qo());
    }), N(y, Un.EventType.CLOSE, () => {
      P || (P = !0, D(_e, `RPC '${e}' stream ${s} transport closed`), k.Uo());
    }), N(y, Un.EventType.ERROR, (V) => {
      P || (P = !0, nn(_e, `RPC '${e}' stream ${s} transport errored:`, V), k.Uo(new O(C.UNAVAILABLE, "The operation could not be completed")));
    }), N(y, Un.EventType.MESSAGE, (V) => {
      var K;
      if (!P) {
        const z = V.data[0];
        G(!!z);
        const H = z, ee = (H == null ? void 0 : H.error) || ((K = H[0]) === null || K === void 0 ? void 0 : K.error);
        if (ee) {
          D(_e, `RPC '${e}' stream ${s} received error:`, ee);
          const Ce = ee.status;
          let te = (
            /**
            * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
            *
            * @returns The Code equivalent to the given status string or undefined if
            *     there is no match.
            */
            function(_) {
              const v = re[_];
              if (v !== void 0) return $l(v);
            }(Ce)
          ), E = ee.message;
          te === void 0 && (te = C.INTERNAL, E = "Unknown error status: " + Ce + " with message " + ee.message), // Mark closed so no further events are propagated
          P = !0, k.Uo(new O(te, E)), y.close();
        } else D(_e, `RPC '${e}' stream ${s} received:`, z), k.Ko(z);
      }
    }), N(u, ul.STAT_EVENT, (V) => {
      V.stat === Ci.PROXY ? D(_e, `RPC '${e}' stream ${s} detected buffering proxy`) : V.stat === Ci.NOPROXY && D(_e, `RPC '${e}' stream ${s} detected no buffering proxy`);
    }), setTimeout(() => {
      k.$o();
    }, 0), k;
  }
}
function vi() {
  return typeof document < "u" ? document : null;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ds(n) {
  return new T_(
    n,
    /* useProto3Json= */
    !0
  );
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class rh {
  constructor(e, t, r = 1e3, s = 1.5, o = 6e4) {
    this.Ti = e, this.timerId = t, this.Go = r, this.zo = s, this.jo = o, this.Ho = 0, this.Jo = null, /** The last backoff attempt, as epoch milliseconds. */
    this.Yo = Date.now(), this.reset();
  }
  /**
   * Resets the backoff delay.
   *
   * The very next backoffAndWait() will have no delay. If it is called again
   * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
   * subsequent ones will increase according to the backoffFactor.
   */
  reset() {
    this.Ho = 0;
  }
  /**
   * Resets the backoff delay to the maximum delay (e.g. for use after a
   * RESOURCE_EXHAUSTED error).
   */
  Zo() {
    this.Ho = this.jo;
  }
  /**
   * Returns a promise that resolves after currentDelayMs, and increases the
   * delay for any subsequent attempts. If there was a pending backoff operation
   * already, it will be canceled.
   */
  Xo(e) {
    this.cancel();
    const t = Math.floor(this.Ho + this.e_()), r = Math.max(0, Date.now() - this.Yo), s = Math.max(0, t - r);
    s > 0 && D("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.Ho} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`), this.Jo = this.Ti.enqueueAfterDelay(this.timerId, s, () => (this.Yo = Date.now(), e())), // Apply backoff factor to determine next delay and ensure it is within
    // bounds.
    this.Ho *= this.zo, this.Ho < this.Go && (this.Ho = this.Go), this.Ho > this.jo && (this.Ho = this.jo);
  }
  t_() {
    this.Jo !== null && (this.Jo.skipDelay(), this.Jo = null);
  }
  cancel() {
    this.Jo !== null && (this.Jo.cancel(), this.Jo = null);
  }
  /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */
  e_() {
    return (Math.random() - 0.5) * this.Ho;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Zc = "PersistentStream";
class sh {
  constructor(e, t, r, s, o, a, u, l) {
    this.Ti = e, this.n_ = r, this.r_ = s, this.connection = o, this.authCredentialsProvider = a, this.appCheckCredentialsProvider = u, this.listener = l, this.state = 0, /**
     * A close count that's incremented every time the stream is closed; used by
     * getCloseGuardedDispatcher() to invalidate callbacks that happen after
     * close.
     */
    this.i_ = 0, this.s_ = null, this.o_ = null, this.stream = null, /**
     * Count of response messages received.
     */
    this.__ = 0, this.a_ = new rh(e, t);
  }
  /**
   * Returns true if start() has been called and no error has occurred. True
   * indicates the stream is open or in the process of opening (which
   * encompasses respecting backoff, getting auth tokens, and starting the
   * actual RPC). Use isOpen() to determine if the stream is open and ready for
   * outbound requests.
   */
  u_() {
    return this.state === 1 || this.state === 5 || this.c_();
  }
  /**
   * Returns true if the underlying RPC is open (the onOpen() listener has been
   * called) and the stream is ready for outbound requests.
   */
  c_() {
    return this.state === 2 || this.state === 3;
  }
  /**
   * Starts the RPC. Only allowed if isStarted() returns false. The stream is
   * not immediately ready for use: onOpen() will be invoked when the RPC is
   * ready for outbound requests, at which point isOpen() will return true.
   *
   * When start returns, isStarted() will return true.
   */
  start() {
    this.__ = 0, this.state !== 4 ? this.auth() : this.l_();
  }
  /**
   * Stops the RPC. This call is idempotent and allowed regardless of the
   * current isStarted() state.
   *
   * When stop returns, isStarted() and isOpen() will both return false.
   */
  async stop() {
    this.u_() && await this.close(
      0
      /* PersistentStreamState.Initial */
    );
  }
  /**
   * After an error the stream will usually back off on the next attempt to
   * start it. If the error warrants an immediate restart of the stream, the
   * sender can use this to indicate that the receiver should not back off.
   *
   * Each error will call the onClose() listener. That function can decide to
   * inhibit backoff if required.
   */
  h_() {
    this.state = 0, this.a_.reset();
  }
  /**
   * Marks this stream as idle. If no further actions are performed on the
   * stream for one minute, the stream will automatically close itself and
   * notify the stream's onClose() handler with Status.OK. The stream will then
   * be in a !isStarted() state, requiring the caller to start the stream again
   * before further use.
   *
   * Only streams that are in state 'Open' can be marked idle, as all other
   * states imply pending network operations.
   */
  P_() {
    this.c_() && this.s_ === null && (this.s_ = this.Ti.enqueueAfterDelay(this.n_, 6e4, () => this.T_()));
  }
  /** Sends a message to the underlying stream. */
  I_(e) {
    this.E_(), this.stream.send(e);
  }
  /** Called by the idle timer when the stream should close due to inactivity. */
  async T_() {
    if (this.c_())
      return this.close(
        0
        /* PersistentStreamState.Initial */
      );
  }
  /** Marks the stream as active again. */
  E_() {
    this.s_ && (this.s_.cancel(), this.s_ = null);
  }
  /** Cancels the health check delayed operation. */
  d_() {
    this.o_ && (this.o_.cancel(), this.o_ = null);
  }
  /**
   * Closes the stream and cleans up as necessary:
   *
   * * closes the underlying GRPC stream;
   * * calls the onClose handler with the given 'error';
   * * sets internal stream state to 'finalState';
   * * adjusts the backoff timer based on the error
   *
   * A new stream can be opened by calling start().
   *
   * @param finalState - the intended state of the stream after closing.
   * @param error - the error the connection was closed with.
   */
  async close(e, t) {
    this.E_(), this.d_(), this.a_.cancel(), // Invalidates any stream-related callbacks (e.g. from auth or the
    // underlying stream), guaranteeing they won't execute.
    this.i_++, e !== 4 ? (
      // If this is an intentional close ensure we don't delay our next connection attempt.
      this.a_.reset()
    ) : t && t.code === C.RESOURCE_EXHAUSTED ? (
      // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
      (Ye(t.toString()), Ye("Using maximum backoff delay to prevent overloading the backend."), this.a_.Zo())
    ) : t && t.code === C.UNAUTHENTICATED && this.state !== 3 && // "unauthenticated" error means the token was rejected. This should rarely
    // happen since both Auth and AppCheck ensure a sufficient TTL when we
    // request a token. If a user manually resets their system clock this can
    // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
    // before we received the first message and we need to invalidate the token
    // to ensure that we fetch a new token.
    (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), // Clean up the underlying stream because we are no longer interested in events.
    this.stream !== null && (this.A_(), this.stream.close(), this.stream = null), // This state must be assigned before calling onClose() to allow the callback to
    // inhibit backoff or otherwise manipulate the state in its non-started state.
    this.state = e, // Notify the listener that the stream closed.
    await this.listener.Lo(t);
  }
  /**
   * Can be overridden to perform additional cleanup before the stream is closed.
   * Calling super.tearDown() is not required.
   */
  A_() {
  }
  auth() {
    this.state = 1;
    const e = this.R_(this.i_), t = this.i_;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([r, s]) => {
      this.i_ === t && // Normally we'd have to schedule the callback on the AsyncQueue.
      // However, the following calls are safe to be called outside the
      // AsyncQueue since they don't chain asynchronous calls
      this.V_(r, s);
    }, (r) => {
      e(() => {
        const s = new O(C.UNKNOWN, "Fetching auth token failed: " + r.message);
        return this.m_(s);
      });
    });
  }
  V_(e, t) {
    const r = this.R_(this.i_);
    this.stream = this.f_(e, t), this.stream.xo(() => {
      r(() => this.listener.xo());
    }), this.stream.No(() => {
      r(() => (this.state = 2, this.o_ = this.Ti.enqueueAfterDelay(this.r_, 1e4, () => (this.c_() && (this.state = 3), Promise.resolve())), this.listener.No()));
    }), this.stream.Lo((s) => {
      r(() => this.m_(s));
    }), this.stream.onMessage((s) => {
      r(() => ++this.__ == 1 ? this.g_(s) : this.onNext(s));
    });
  }
  l_() {
    this.state = 5, this.a_.Xo(async () => {
      this.state = 0, this.start();
    });
  }
  // Visible for tests
  m_(e) {
    return D(Zc, `close with error: ${e}`), this.stream = null, this.close(4, e);
  }
  /**
   * Returns a "dispatcher" function that dispatches operations onto the
   * AsyncQueue but only runs them if closeCount remains unchanged. This allows
   * us to turn auth / stream callbacks into no-ops if the stream is closed /
   * re-opened, etc.
   */
  R_(e) {
    return (t) => {
      this.Ti.enqueueAndForget(() => this.i_ === e ? t() : (D(Zc, "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
    };
  }
}
class yy extends sh {
  constructor(e, t, r, s, o, a) {
    super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, r, s, a), this.serializer = o;
  }
  f_(e, t) {
    return this.connection.Wo("Listen", e, t);
  }
  g_(e) {
    return this.onNext(e);
  }
  onNext(e) {
    this.a_.reset();
    const t = A_(this.serializer, e), r = function(o) {
      if (!("targetChange" in o)) return U.min();
      const a = o.targetChange;
      return a.targetIds && a.targetIds.length ? U.min() : a.readTime ? Fe(a.readTime) : U.min();
    }(e);
    return this.listener.p_(t, r);
  }
  /**
   * Registers interest in the results of the given target. If the target
   * includes a resumeToken it will be included in the request. Results that
   * affect the target will be streamed back as WatchChange messages that
   * reference the targetId.
   */
  y_(e) {
    const t = {};
    t.database = Ui(this.serializer), t.addTarget = function(o, a) {
      let u;
      const l = a.target;
      if (u = Ni(l) ? {
        documents: P_(o, l)
      } : {
        query: C_(o, l).ht
      }, u.targetId = a.targetId, a.resumeToken.approximateByteSize() > 0) {
        u.resumeToken = Wl(o, a.resumeToken);
        const d = Li(o, a.expectedCount);
        d !== null && (u.expectedCount = d);
      } else if (a.snapshotVersion.compareTo(U.min()) > 0) {
        u.readTime = hs(o, a.snapshotVersion.toTimestamp());
        const d = Li(o, a.expectedCount);
        d !== null && (u.expectedCount = d);
      }
      return u;
    }(this.serializer, e);
    const r = k_(this.serializer, e);
    r && (t.labels = r), this.I_(t);
  }
  /**
   * Unregisters interest in the results of the target associated with the
   * given targetId.
   */
  w_(e) {
    const t = {};
    t.database = Ui(this.serializer), t.removeTarget = e, this.I_(t);
  }
}
class vy extends sh {
  constructor(e, t, r, s, o, a) {
    super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, r, s, a), this.serializer = o;
  }
  /**
   * Tracks whether or not a handshake has been successfully exchanged and
   * the stream is ready to accept mutations.
   */
  get S_() {
    return this.__ > 0;
  }
  // Override of PersistentStream.start
  start() {
    this.lastStreamToken = void 0, super.start();
  }
  A_() {
    this.S_ && this.b_([]);
  }
  f_(e, t) {
    return this.connection.Wo("Write", e, t);
  }
  g_(e) {
    return G(!!e.streamToken), this.lastStreamToken = e.streamToken, // The first response is always the handshake response
    G(!e.writeResults || e.writeResults.length === 0), this.listener.D_();
  }
  onNext(e) {
    G(!!e.streamToken), this.lastStreamToken = e.streamToken, // A successful first write response means the stream is healthy,
    // Note, that we could consider a successful handshake healthy, however,
    // the write itself might be causing an error we want to back off from.
    this.a_.reset();
    const t = S_(e.writeResults, e.commitTime), r = Fe(e.commitTime);
    return this.listener.v_(r, t);
  }
  /**
   * Sends an initial streamToken to the server, performing the handshake
   * required to make the StreamingWrite RPC work. Subsequent
   * calls should wait until onHandshakeComplete was called.
   */
  C_() {
    const e = {};
    e.database = Ui(this.serializer), this.I_(e);
  }
  /** Sends a group of mutations to the Firestore backend to apply. */
  b_(e) {
    const t = {
      streamToken: this.lastStreamToken,
      writes: e.map((r) => R_(this.serializer, r))
    };
    this.I_(t);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ey {
}
class Ty extends Ey {
  constructor(e, t, r, s) {
    super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = r, this.serializer = s, this.F_ = !1;
  }
  M_() {
    if (this.F_) throw new O(C.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  /** Invokes the provided RPC with auth and AppCheck tokens. */
  So(e, t, r, s) {
    return this.M_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([o, a]) => this.connection.So(e, Mi(t, r), s, o, a)).catch((o) => {
      throw o.name === "FirebaseError" ? (o.code === C.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), o) : new O(C.UNKNOWN, o.toString());
    });
  }
  /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
  Co(e, t, r, s, o) {
    return this.M_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([a, u]) => this.connection.Co(e, Mi(t, r), s, a, u, o)).catch((a) => {
      throw a.name === "FirebaseError" ? (a.code === C.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), a) : new O(C.UNKNOWN, a.toString());
    });
  }
  terminate() {
    this.F_ = !0, this.connection.terminate();
  }
}
class Iy {
  constructor(e, t) {
    this.asyncQueue = e, this.onlineStateHandler = t, /** The current OnlineState. */
    this.state = "Unknown", /**
     * A count of consecutive failures to open the stream. If it reaches the
     * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
     * Offline.
     */
    this.x_ = 0, /**
     * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
     * transition from OnlineState.Unknown to OnlineState.Offline without waiting
     * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
     */
    this.O_ = null, /**
     * Whether the client should log a warning message if it fails to connect to
     * the backend (initially true, cleared after a successful stream, or if we've
     * logged the message already).
     */
    this.N_ = !0;
  }
  /**
   * Called by RemoteStore when a watch stream is started (including on each
   * backoff attempt).
   *
   * If this is the first attempt, it sets the OnlineState to Unknown and starts
   * the onlineStateTimer.
   */
  B_() {
    this.x_ === 0 && (this.L_(
      "Unknown"
      /* OnlineState.Unknown */
    ), this.O_ = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this.O_ = null, this.k_("Backend didn't respond within 10 seconds."), this.L_(
      "Offline"
      /* OnlineState.Offline */
    ), Promise.resolve())));
  }
  /**
   * Updates our OnlineState as appropriate after the watch stream reports a
   * failure. The first failure moves us to the 'Unknown' state. We then may
   * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
   * actually transition to the 'Offline' state.
   */
  q_(e) {
    this.state === "Online" ? this.L_(
      "Unknown"
      /* OnlineState.Unknown */
    ) : (this.x_++, this.x_ >= 1 && (this.Q_(), this.k_(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.L_(
      "Offline"
      /* OnlineState.Offline */
    )));
  }
  /**
   * Explicitly sets the OnlineState to the specified state.
   *
   * Note that this resets our timers / failure counters, etc. used by our
   * Offline heuristics, so must not be used in place of
   * handleWatchStreamStart() and handleWatchStreamFailure().
   */
  set(e) {
    this.Q_(), this.x_ = 0, e === "Online" && // We've connected to watch at least once. Don't warn the developer
    // about being offline going forward.
    (this.N_ = !1), this.L_(e);
  }
  L_(e) {
    e !== this.state && (this.state = e, this.onlineStateHandler(e));
  }
  k_(e) {
    const t = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.N_ ? (Ye(t), this.N_ = !1) : D("OnlineStateTracker", t);
  }
  Q_() {
    this.O_ !== null && (this.O_.cancel(), this.O_ = null);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const xt = "RemoteStore";
class wy {
  constructor(e, t, r, s, o) {
    this.localStore = e, this.datastore = t, this.asyncQueue = r, this.remoteSyncer = {}, /**
     * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
     * LocalStore via fillWritePipeline() and have or will send to the write
     * stream.
     *
     * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
     * restart the write stream. When the stream is established the writes in the
     * pipeline will be sent in order.
     *
     * Writes remain in writePipeline until they are acknowledged by the backend
     * and thus will automatically be re-sent if the stream is interrupted /
     * restarted before they're acknowledged.
     *
     * Write responses from the backend are linked to their originating request
     * purely based on order, and so we can just shift() writes from the front of
     * the writePipeline as we receive responses.
     */
    this.U_ = [], /**
     * A mapping of watched targets that the client cares about tracking and the
     * user has explicitly called a 'listen' for this target.
     *
     * These targets may or may not have been sent to or acknowledged by the
     * server. On re-establishing the listen stream, these targets should be sent
     * to the server. The targets removed with unlistens are removed eagerly
     * without waiting for confirmation from the listen stream.
     */
    this.K_ = /* @__PURE__ */ new Map(), /**
     * A set of reasons for why the RemoteStore may be offline. If empty, the
     * RemoteStore may start its network connections.
     */
    this.W_ = /* @__PURE__ */ new Set(), /**
     * Event handlers that get called when the network is disabled or enabled.
     *
     * PORTING NOTE: These functions are used on the Web client to create the
     * underlying streams (to support tree-shakeable streams). On Android and iOS,
     * the streams are created during construction of RemoteStore.
     */
    this.G_ = [], this.z_ = o, this.z_.To((a) => {
      r.enqueueAndForget(async () => {
        Bt(this) && (D(xt, "Restarting streams for network reachability change."), await async function(l) {
          const d = F(l);
          d.W_.add(
            4
            /* OfflineCause.ConnectivityChange */
          ), await hr(d), d.j_.set(
            "Unknown"
            /* OnlineState.Unknown */
          ), d.W_.delete(
            4
            /* OfflineCause.ConnectivityChange */
          ), await Ns(d);
        }(this));
      });
    }), this.j_ = new Iy(r, s);
  }
}
async function Ns(n) {
  if (Bt(n)) for (const e of n.G_) await e(
    /* enabled= */
    !0
  );
}
async function hr(n) {
  for (const e of n.G_) await e(
    /* enabled= */
    !1
  );
}
function ih(n, e) {
  const t = F(n);
  t.K_.has(e.targetId) || // Mark this as something the client is currently listening for.
  (t.K_.set(e.targetId, e), wo(t) ? (
    // The listen will be sent in onWatchStreamOpen
    Io(t)
  ) : _n(t).c_() && To(t, e));
}
function Eo(n, e) {
  const t = F(n), r = _n(t);
  t.K_.delete(e), r.c_() && oh(t, e), t.K_.size === 0 && (r.c_() ? r.P_() : Bt(t) && // Revert to OnlineState.Unknown if the watch stream is not open and we
  // have no listeners, since without any listens to send we cannot
  // confirm if the stream is healthy and upgrade to OnlineState.Online.
  t.j_.set(
    "Unknown"
    /* OnlineState.Unknown */
  ));
}
function To(n, e) {
  if (n.H_.Ne(e.targetId), e.resumeToken.approximateByteSize() > 0 || e.snapshotVersion.compareTo(U.min()) > 0) {
    const t = n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;
    e = e.withExpectedCount(t);
  }
  _n(n).y_(e);
}
function oh(n, e) {
  n.H_.Ne(e), _n(n).w_(e);
}
function Io(n) {
  n.H_ = new __({
    getRemoteKeysForTarget: (e) => n.remoteSyncer.getRemoteKeysForTarget(e),
    lt: (e) => n.K_.get(e) || null,
    it: () => n.datastore.serializer.databaseId
  }), _n(n).start(), n.j_.B_();
}
function wo(n) {
  return Bt(n) && !_n(n).u_() && n.K_.size > 0;
}
function Bt(n) {
  return F(n).W_.size === 0;
}
function ah(n) {
  n.H_ = void 0;
}
async function Ay(n) {
  n.j_.set(
    "Online"
    /* OnlineState.Online */
  );
}
async function Ry(n) {
  n.K_.forEach((e, t) => {
    To(n, e);
  });
}
async function Sy(n, e) {
  ah(n), // If we still need the watch stream, retry the connection.
  wo(n) ? (n.j_.q_(e), Io(n)) : (
    // No need to restart watch stream because there are no active targets.
    // The online state is set to unknown because there is no active attempt
    // at establishing a connection
    n.j_.set(
      "Unknown"
      /* OnlineState.Unknown */
    )
  );
}
async function Py(n, e, t) {
  if (
    // Mark the client as online since we got a message from the server
    n.j_.set(
      "Online"
      /* OnlineState.Online */
    ), e instanceof Hl && e.state === 2 && e.cause
  )
    try {
      await async function(s, o) {
        const a = o.cause;
        for (const u of o.targetIds)
          s.K_.has(u) && (await s.remoteSyncer.rejectListen(u, a), s.K_.delete(u), s.H_.removeTarget(u));
      }(n, e);
    } catch (r) {
      D(xt, "Failed to remove targets %s: %s ", e.targetIds.join(","), r), await fs(n, r);
    }
  else if (e instanceof Gr ? n.H_.We(e) : e instanceof zl ? n.H_.Ze(e) : n.H_.je(e), !t.isEqual(U.min())) try {
    const r = await nh(n.localStore);
    t.compareTo(r) >= 0 && // We have received a target change with a global snapshot if the snapshot
    // version is not equal to SnapshotVersion.min().
    /**
    * Takes a batch of changes from the Datastore, repackages them as a
    * RemoteEvent, and passes that on to the listener, which is typically the
    * SyncEngine.
    */
    await function(o, a) {
      const u = o.H_.ot(a);
      return u.targetChanges.forEach((l, d) => {
        if (l.resumeToken.approximateByteSize() > 0) {
          const p = o.K_.get(d);
          p && o.K_.set(d, p.withResumeToken(l.resumeToken, a));
        }
      }), // Re-establish listens for the targets that have been invalidated by
      // existence filter mismatches.
      u.targetMismatches.forEach((l, d) => {
        const p = o.K_.get(l);
        if (!p)
          return;
        o.K_.set(l, p.withResumeToken(de.EMPTY_BYTE_STRING, p.snapshotVersion)), // Cause a hard reset by unwatching and rewatching immediately, but
        // deliberately don't send a resume token so that we get a full update.
        oh(o, l);
        const y = new lt(p.target, l, d, p.sequenceNumber);
        To(o, y);
      }), o.remoteSyncer.applyRemoteEvent(u);
    }(n, t);
  } catch (r) {
    D(xt, "Failed to raise snapshot:", r), await fs(n, r);
  }
}
async function fs(n, e, t) {
  if (!gn(e)) throw e;
  n.W_.add(
    1
    /* OfflineCause.IndexedDbFailed */
  ), // Disable network and raise offline snapshots
  await hr(n), n.j_.set(
    "Offline"
    /* OnlineState.Offline */
  ), t || // Use a simple read operation to determine if IndexedDB recovered.
  // Ideally, we would expose a health check directly on SimpleDb, but
  // RemoteStore only has access to persistence through LocalStore.
  (t = () => nh(n.localStore)), // Probe IndexedDB periodically and re-enable network
  n.asyncQueue.enqueueRetryable(async () => {
    D(xt, "Retrying IndexedDB access"), await t(), n.W_.delete(
      1
      /* OfflineCause.IndexedDbFailed */
    ), await Ns(n);
  });
}
function ch(n, e) {
  return e().catch((t) => fs(n, t, e));
}
async function Os(n) {
  const e = F(n), t = Tt(e);
  let r = e.U_.length > 0 ? e.U_[e.U_.length - 1].batchId : so;
  for (; Cy(e); ) try {
    const s = await uy(e.localStore, r);
    if (s === null) {
      e.U_.length === 0 && t.P_();
      break;
    }
    r = s.batchId, by(e, s);
  } catch (s) {
    await fs(e, s);
  }
  uh(e) && lh(e);
}
function Cy(n) {
  return Bt(n) && n.U_.length < 10;
}
function by(n, e) {
  n.U_.push(e);
  const t = Tt(n);
  t.c_() && t.S_ && t.b_(e.mutations);
}
function uh(n) {
  return Bt(n) && !Tt(n).u_() && n.U_.length > 0;
}
function lh(n) {
  Tt(n).start();
}
async function ky(n) {
  Tt(n).C_();
}
async function Vy(n) {
  const e = Tt(n);
  for (const t of n.U_) e.b_(t.mutations);
}
async function Dy(n, e, t) {
  const r = n.U_.shift(), s = fo.from(r, e, t);
  await ch(n, () => n.remoteSyncer.applySuccessfulWrite(s)), // It's possible that with the completion of this mutation another
  // slot has freed up.
  await Os(n);
}
async function Ny(n, e) {
  e && Tt(n).S_ && // This error affects the actual write.
  await async function(r, s) {
    if (function(a) {
      return m_(a) && a !== C.ABORTED;
    }(s.code)) {
      const o = r.U_.shift();
      Tt(r).h_(), await ch(r, () => r.remoteSyncer.rejectFailedWrite(o.batchId, s)), // It's possible that with the completion of this mutation
      // another slot has freed up.
      await Os(r);
    }
  }(n, e), // The write stream might have been started by refilling the write
  // pipeline for failed writes
  uh(n) && lh(n);
}
async function eu(n, e) {
  const t = F(n);
  t.asyncQueue.verifyOperationInProgress(), D(xt, "RemoteStore received new credentials");
  const r = Bt(t);
  t.W_.add(
    3
    /* OfflineCause.CredentialChange */
  ), await hr(t), r && // Don't set the network status to Unknown if we are offline.
  t.j_.set(
    "Unknown"
    /* OnlineState.Unknown */
  ), await t.remoteSyncer.handleCredentialChange(e), t.W_.delete(
    3
    /* OfflineCause.CredentialChange */
  ), await Ns(t);
}
async function Oy(n, e) {
  const t = F(n);
  e ? (t.W_.delete(
    2
    /* OfflineCause.IsSecondary */
  ), await Ns(t)) : e || (t.W_.add(
    2
    /* OfflineCause.IsSecondary */
  ), await hr(t), t.j_.set(
    "Unknown"
    /* OnlineState.Unknown */
  ));
}
function _n(n) {
  return n.J_ || // Create stream (but note that it is not started yet).
  (n.J_ = function(t, r, s) {
    const o = F(t);
    return o.M_(), new yy(r, o.connection, o.authCredentials, o.appCheckCredentials, o.serializer, s);
  }(n.datastore, n.asyncQueue, {
    xo: Ay.bind(null, n),
    No: Ry.bind(null, n),
    Lo: Sy.bind(null, n),
    p_: Py.bind(null, n)
  }), n.G_.push(async (e) => {
    e ? (n.J_.h_(), wo(n) ? Io(n) : n.j_.set(
      "Unknown"
      /* OnlineState.Unknown */
    )) : (await n.J_.stop(), ah(n));
  })), n.J_;
}
function Tt(n) {
  return n.Y_ || // Create stream (but note that it is not started yet).
  (n.Y_ = function(t, r, s) {
    const o = F(t);
    return o.M_(), new vy(r, o.connection, o.authCredentials, o.appCheckCredentials, o.serializer, s);
  }(n.datastore, n.asyncQueue, {
    xo: () => Promise.resolve(),
    No: ky.bind(null, n),
    Lo: Ny.bind(null, n),
    D_: Vy.bind(null, n),
    v_: Dy.bind(null, n)
  }), n.G_.push(async (e) => {
    e ? (n.Y_.h_(), // This will start the write stream if necessary.
    await Os(n)) : (await n.Y_.stop(), n.U_.length > 0 && (D(xt, `Stopping write stream with ${n.U_.length} pending writes`), n.U_ = []));
  })), n.Y_;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ao {
  constructor(e, t, r, s, o) {
    this.asyncQueue = e, this.timerId = t, this.targetTimeMs = r, this.op = s, this.removalCallback = o, this.deferred = new Qe(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
    // and so we attach a dummy catch callback to avoid
    // 'UnhandledPromiseRejectionWarning' log spam.
    this.deferred.promise.catch((a) => {
    });
  }
  get promise() {
    return this.deferred.promise;
  }
  /**
   * Creates and returns a DelayedOperation that has been scheduled to be
   * executed on the provided asyncQueue after the provided delayMs.
   *
   * @param asyncQueue - The queue to schedule the operation on.
   * @param id - A Timer ID identifying the type of operation this is.
   * @param delayMs - The delay (ms) before the operation should be scheduled.
   * @param op - The operation to run.
   * @param removalCallback - A callback to be called synchronously once the
   *   operation is executed or canceled, notifying the AsyncQueue to remove it
   *   from its delayedOperations list.
   *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
   *   the DelayedOperation class public.
   */
  static createAndSchedule(e, t, r, s, o) {
    const a = Date.now() + r, u = new Ao(e, t, a, s, o);
    return u.start(r), u;
  }
  /**
   * Starts the timer. This is called immediately after construction by
   * createAndSchedule().
   */
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  /**
   * Queues the operation to run immediately (if it hasn't already been run or
   * canceled).
   */
  skipDelay() {
    return this.handleDelayElapsed();
  }
  /**
   * Cancels the operation if it hasn't already been executed or canceled. The
   * promise will be rejected.
   *
   * As long as the operation has not yet been run, calling cancel() provides a
   * guarantee that the operation will not be run.
   */
  cancel(e) {
    this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new O(C.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => this.timerHandle !== null ? (this.clearTimeout(), this.op().then((e) => this.deferred.resolve(e))) : Promise.resolve());
  }
  clearTimeout() {
    this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
}
function Ro(n, e) {
  if (Ye("AsyncQueue", `${e}: ${n}`), gn(n)) return new O(C.UNAVAILABLE, `${e}: ${n}`);
  throw n;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Zt {
  /**
   * Returns an empty copy of the existing DocumentSet, using the same
   * comparator.
   */
  static emptySet(e) {
    return new Zt(e.comparator);
  }
  /** The default ordering is by key if the comparator is omitted */
  constructor(e) {
    this.comparator = e ? (t, r) => e(t, r) || L.comparator(t.key, r.key) : (t, r) => L.comparator(t.key, r.key), this.keyedMap = Fn(), this.sortedSet = new Y(this.comparator);
  }
  has(e) {
    return this.keyedMap.get(e) != null;
  }
  get(e) {
    return this.keyedMap.get(e);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  /**
   * Returns the index of the provided key in the document set, or -1 if the
   * document key is not present in the set;
   */
  indexOf(e) {
    const t = this.keyedMap.get(e);
    return t ? this.sortedSet.indexOf(t) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  /** Iterates documents in order defined by "comparator" */
  forEach(e) {
    this.sortedSet.inorderTraversal((t, r) => (e(t), !1));
  }
  /** Inserts or updates a document with the same key */
  add(e) {
    const t = this.delete(e.key);
    return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
  }
  /** Deletes a document with a given key */
  delete(e) {
    const t = this.get(e);
    return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
  }
  isEqual(e) {
    if (!(e instanceof Zt) || this.size !== e.size) return !1;
    const t = this.sortedSet.getIterator(), r = e.sortedSet.getIterator();
    for (; t.hasNext(); ) {
      const s = t.getNext().key, o = r.getNext().key;
      if (!s.isEqual(o)) return !1;
    }
    return !0;
  }
  toString() {
    const e = [];
    return this.forEach((t) => {
      e.push(t.toString());
    }), e.length === 0 ? "DocumentSet ()" : `DocumentSet (
  ` + e.join(`  
`) + `
)`;
  }
  copy(e, t) {
    const r = new Zt();
    return r.comparator = this.comparator, r.keyedMap = e, r.sortedSet = t, r;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class tu {
  constructor() {
    this.Z_ = new Y(L.comparator);
  }
  track(e) {
    const t = e.doc.key, r = this.Z_.get(t);
    r ? (
      // Merge the new change with the existing change.
      e.type !== 0 && r.type === 3 ? this.Z_ = this.Z_.insert(t, e) : e.type === 3 && r.type !== 1 ? this.Z_ = this.Z_.insert(t, {
        type: r.type,
        doc: e.doc
      }) : e.type === 2 && r.type === 2 ? this.Z_ = this.Z_.insert(t, {
        type: 2,
        doc: e.doc
      }) : e.type === 2 && r.type === 0 ? this.Z_ = this.Z_.insert(t, {
        type: 0,
        doc: e.doc
      }) : e.type === 1 && r.type === 0 ? this.Z_ = this.Z_.remove(t) : e.type === 1 && r.type === 2 ? this.Z_ = this.Z_.insert(t, {
        type: 1,
        doc: r.doc
      }) : e.type === 0 && r.type === 1 ? this.Z_ = this.Z_.insert(t, {
        type: 2,
        doc: e.doc
      }) : (
        // This includes these cases, which don't make sense:
        // Added->Added
        // Removed->Removed
        // Modified->Added
        // Removed->Modified
        // Metadata->Added
        // Removed->Metadata
        x()
      )
    ) : this.Z_ = this.Z_.insert(t, e);
  }
  X_() {
    const e = [];
    return this.Z_.inorderTraversal((t, r) => {
      e.push(r);
    }), e;
  }
}
class cn {
  constructor(e, t, r, s, o, a, u, l, d) {
    this.query = e, this.docs = t, this.oldDocs = r, this.docChanges = s, this.mutatedKeys = o, this.fromCache = a, this.syncStateChanged = u, this.excludesMetadataChanges = l, this.hasCachedResults = d;
  }
  /** Returns a view snapshot as if all documents in the snapshot were added. */
  static fromInitialDocuments(e, t, r, s, o) {
    const a = [];
    return t.forEach((u) => {
      a.push({
        type: 0,
        doc: u
      });
    }), new cn(
      e,
      t,
      Zt.emptySet(t),
      a,
      r,
      s,
      /* syncStateChanged= */
      !0,
      /* excludesMetadataChanges= */
      !1,
      o
    );
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(e) {
    if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && Ps(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs))) return !1;
    const t = this.docChanges, r = e.docChanges;
    if (t.length !== r.length) return !1;
    for (let s = 0; s < t.length; s++) if (t[s].type !== r[s].type || !t[s].doc.isEqual(r[s].doc)) return !1;
    return !0;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ly {
  constructor() {
    this.ea = void 0, this.ta = [];
  }
  // Helper methods that checks if the query has listeners that listening to remote store
  na() {
    return this.ta.some((e) => e.ra());
  }
}
class My {
  constructor() {
    this.queries = nu(), this.onlineState = "Unknown", this.ia = /* @__PURE__ */ new Set();
  }
  terminate() {
    (function(t, r) {
      const s = F(t), o = s.queries;
      s.queries = nu(), o.forEach((a, u) => {
        for (const l of u.ta) l.onError(r);
      });
    })(this, new O(C.ABORTED, "Firestore shutting down"));
  }
}
function nu() {
  return new Ft((n) => Vl(n), Ps);
}
async function hh(n, e) {
  const t = F(n);
  let r = 3;
  const s = e.query;
  let o = t.queries.get(s);
  o ? !o.na() && e.ra() && // Query has been listening to local cache, and tries to add a new listener sourced from watch.
  (r = 2) : (o = new Ly(), r = e.ra() ? 0 : 1);
  try {
    switch (r) {
      case 0:
        o.ea = await t.onListen(
          s,
          /** enableRemoteListen= */
          !0
        );
        break;
      case 1:
        o.ea = await t.onListen(
          s,
          /** enableRemoteListen= */
          !1
        );
        break;
      case 2:
        await t.onFirstRemoteStoreListen(s);
    }
  } catch (a) {
    const u = Ro(a, `Initialization of query '${Wt(e.query)}' failed`);
    return void e.onError(u);
  }
  t.queries.set(s, o), o.ta.push(e), // Run global snapshot listeners if a consistent snapshot has been emitted.
  e.sa(t.onlineState), o.ea && e.oa(o.ea) && So(t);
}
async function dh(n, e) {
  const t = F(n), r = e.query;
  let s = 3;
  const o = t.queries.get(r);
  if (o) {
    const a = o.ta.indexOf(e);
    a >= 0 && (o.ta.splice(a, 1), o.ta.length === 0 ? s = e.ra() ? 0 : 1 : !o.na() && e.ra() && // The removed listener is the last one that sourced from watch.
    (s = 2));
  }
  switch (s) {
    case 0:
      return t.queries.delete(r), t.onUnlisten(
        r,
        /** disableRemoteListen= */
        !0
      );
    case 1:
      return t.queries.delete(r), t.onUnlisten(
        r,
        /** disableRemoteListen= */
        !1
      );
    case 2:
      return t.onLastRemoteStoreUnlisten(r);
    default:
      return;
  }
}
function xy(n, e) {
  const t = F(n);
  let r = !1;
  for (const s of e) {
    const o = s.query, a = t.queries.get(o);
    if (a) {
      for (const u of a.ta) u.oa(s) && (r = !0);
      a.ea = s;
    }
  }
  r && So(t);
}
function Uy(n, e, t) {
  const r = F(n), s = r.queries.get(e);
  if (s) for (const o of s.ta) o.onError(t);
  r.queries.delete(e);
}
function So(n) {
  n.ia.forEach((e) => {
    e.next();
  });
}
var ji, ru;
(ru = ji || (ji = {}))._a = "default", /** Listen to changes in cache only */
ru.Cache = "cache";
class fh {
  constructor(e, t, r) {
    this.query = e, this.aa = t, /**
     * Initial snapshots (e.g. from cache) may not be propagated to the wrapped
     * observer. This flag is set to true once we've actually raised an event.
     */
    this.ua = !1, this.ca = null, this.onlineState = "Unknown", this.options = r || {};
  }
  /**
   * Applies the new ViewSnapshot to this listener, raising a user-facing event
   * if applicable (depending on what changed, whether the user has opted into
   * metadata-only changes, etc.). Returns true if a user-facing event was
   * indeed raised.
   */
  oa(e) {
    if (!this.options.includeMetadataChanges) {
      const r = [];
      for (const s of e.docChanges) s.type !== 3 && r.push(s);
      e = new cn(
        e.query,
        e.docs,
        e.oldDocs,
        r,
        e.mutatedKeys,
        e.fromCache,
        e.syncStateChanged,
        /* excludesMetadataChanges= */
        !0,
        e.hasCachedResults
      );
    }
    let t = !1;
    return this.ua ? this.la(e) && (this.aa.next(e), t = !0) : this.ha(e, this.onlineState) && (this.Pa(e), t = !0), this.ca = e, t;
  }
  onError(e) {
    this.aa.error(e);
  }
  /** Returns whether a snapshot was raised. */
  sa(e) {
    this.onlineState = e;
    let t = !1;
    return this.ca && !this.ua && this.ha(this.ca, e) && (this.Pa(this.ca), t = !0), t;
  }
  ha(e, t) {
    if (!e.fromCache || !this.ra()) return !0;
    const r = t !== "Offline";
    return (!this.options.Ta || !r) && (!e.docs.isEmpty() || e.hasCachedResults || t === "Offline");
  }
  la(e) {
    if (e.docChanges.length > 0) return !0;
    const t = this.ca && this.ca.hasPendingWrites !== e.hasPendingWrites;
    return !(!e.syncStateChanged && !t) && this.options.includeMetadataChanges === !0;
  }
  Pa(e) {
    e = cn.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.ua = !0, this.aa.next(e);
  }
  ra() {
    return this.options.source !== ji.Cache;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ph {
  constructor(e) {
    this.key = e;
  }
}
class mh {
  constructor(e) {
    this.key = e;
  }
}
class Fy {
  constructor(e, t) {
    this.query = e, this.fa = t, this.ga = null, this.hasCachedResults = !1, /**
     * A flag whether the view is current with the backend. A view is considered
     * current after it has seen the current flag from the backend and did not
     * lose consistency within the watch stream (e.g. because of an existence
     * filter mismatch).
     */
    this.current = !1, /** Documents in the view but not in the remote target */
    this.pa = q(), /** Document Keys that have local changes */
    this.mutatedKeys = q(), this.ya = Dl(e), this.wa = new Zt(this.ya);
  }
  /**
   * The set of remote documents that the server has told us belongs to the target associated with
   * this view.
   */
  get Sa() {
    return this.fa;
  }
  /**
   * Iterates over a set of doc changes, applies the query limit, and computes
   * what the new results should be, what the changes were, and whether we may
   * need to go back to the local cache for more results. Does not make any
   * changes to the view.
   * @param docChanges - The doc changes to apply to this view.
   * @param previousChanges - If this is being called with a refill, then start
   *        with this set of docs and changes instead of the current view.
   * @returns a new set of docs, changes, and refill flag.
   */
  ba(e, t) {
    const r = t ? t.Da : new tu(), s = t ? t.wa : this.wa;
    let o = t ? t.mutatedKeys : this.mutatedKeys, a = s, u = !1;
    const l = this.query.limitType === "F" && s.size === this.query.limit ? s.last() : null, d = this.query.limitType === "L" && s.size === this.query.limit ? s.first() : null;
    if (e.inorderTraversal((p, y) => {
      const w = s.get(p), P = Cs(this.query, y) ? y : null, k = !!w && this.mutatedKeys.has(w.key), N = !!P && (P.hasLocalMutations || // We only consider committed mutations for documents that were
      // mutated during the lifetime of the view.
      this.mutatedKeys.has(P.key) && P.hasCommittedMutations);
      let V = !1;
      w && P ? w.data.isEqual(P.data) ? k !== N && (r.track({
        type: 3,
        doc: P
      }), V = !0) : this.va(w, P) || (r.track({
        type: 2,
        doc: P
      }), V = !0, (l && this.ya(P, l) > 0 || d && this.ya(P, d) < 0) && // This doc moved from inside the limit to outside the limit.
      // That means there may be some other doc in the local cache
      // that should be included instead.
      (u = !0)) : !w && P ? (r.track({
        type: 0,
        doc: P
      }), V = !0) : w && !P && (r.track({
        type: 1,
        doc: w
      }), V = !0, (l || d) && // A doc was removed from a full limit query. We'll need to
      // requery from the local cache to see if we know about some other
      // doc that should be in the results.
      (u = !0)), V && (P ? (a = a.add(P), o = N ? o.add(p) : o.delete(p)) : (a = a.delete(p), o = o.delete(p)));
    }), this.query.limit !== null) for (; a.size > this.query.limit; ) {
      const p = this.query.limitType === "F" ? a.last() : a.first();
      a = a.delete(p.key), o = o.delete(p.key), r.track({
        type: 1,
        doc: p
      });
    }
    return {
      wa: a,
      Da: r,
      ls: u,
      mutatedKeys: o
    };
  }
  va(e, t) {
    return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
  }
  /**
   * Updates the view with the given ViewDocumentChanges and optionally updates
   * limbo docs and sync state from the provided target change.
   * @param docChanges - The set of changes to make to the view's docs.
   * @param limboResolutionEnabled - Whether to update limbo documents based on
   *        this change.
   * @param targetChange - A target change to apply for computing limbo docs and
   *        sync state.
   * @param targetIsPendingReset - Whether the target is pending to reset due to
   *        existence filter mismatch. If not explicitly specified, it is treated
   *        equivalently to `false`.
   * @returns A new ViewChange with the given docs, changes, and sync state.
   */
  // PORTING NOTE: The iOS/Android clients always compute limbo document changes.
  applyChanges(e, t, r, s) {
    const o = this.wa;
    this.wa = e.wa, this.mutatedKeys = e.mutatedKeys;
    const a = e.Da.X_();
    a.sort((p, y) => function(P, k) {
      const N = (V) => {
        switch (V) {
          case 0:
            return 1;
          case 2:
          case 3:
            return 2;
          case 1:
            return 0;
          default:
            return x();
        }
      };
      return N(P) - N(k);
    }(p.type, y.type) || this.ya(p.doc, y.doc)), this.Ca(r), s = s != null && s;
    const u = t && !s ? this.Fa() : [], l = this.pa.size === 0 && this.current && !s ? 1 : 0, d = l !== this.ga;
    return this.ga = l, a.length !== 0 || d ? {
      snapshot: new cn(
        this.query,
        e.wa,
        o,
        a,
        e.mutatedKeys,
        l === 0,
        d,
        /* excludesMetadataChanges= */
        !1,
        !!r && r.resumeToken.approximateByteSize() > 0
      ),
      Ma: u
    } : {
      Ma: u
    };
  }
  /**
   * Applies an OnlineState change to the view, potentially generating a
   * ViewChange if the view's syncState changes as a result.
   */
  sa(e) {
    return this.current && e === "Offline" ? (
      // If we're offline, set `current` to false and then call applyChanges()
      // to refresh our syncState and generate a ViewChange as appropriate. We
      // are guaranteed to get a new TargetChange that sets `current` back to
      // true once the client is back online.
      (this.current = !1, this.applyChanges(
        {
          wa: this.wa,
          Da: new tu(),
          mutatedKeys: this.mutatedKeys,
          ls: !1
        },
        /* limboResolutionEnabled= */
        !1
      ))
    ) : {
      Ma: []
    };
  }
  /**
   * Returns whether the doc for the given key should be in limbo.
   */
  xa(e) {
    return !this.fa.has(e) && // The local store doesn't think it's a result, so it shouldn't be in limbo.
    !!this.wa.has(e) && !this.wa.get(e).hasLocalMutations;
  }
  /**
   * Updates syncedDocuments, current, and limbo docs based on the given change.
   * Returns the list of changes to which docs are in limbo.
   */
  Ca(e) {
    e && (e.addedDocuments.forEach((t) => this.fa = this.fa.add(t)), e.modifiedDocuments.forEach((t) => {
    }), e.removedDocuments.forEach((t) => this.fa = this.fa.delete(t)), this.current = e.current);
  }
  Fa() {
    if (!this.current) return [];
    const e = this.pa;
    this.pa = q(), this.wa.forEach((r) => {
      this.xa(r.key) && (this.pa = this.pa.add(r.key));
    });
    const t = [];
    return e.forEach((r) => {
      this.pa.has(r) || t.push(new mh(r));
    }), this.pa.forEach((r) => {
      e.has(r) || t.push(new ph(r));
    }), t;
  }
  /**
   * Update the in-memory state of the current view with the state read from
   * persistence.
   *
   * We update the query view whenever a client's primary status changes:
   * - When a client transitions from primary to secondary, it can miss
   *   LocalStorage updates and its query views may temporarily not be
   *   synchronized with the state on disk.
   * - For secondary to primary transitions, the client needs to update the list
   *   of `syncedDocuments` since secondary clients update their query views
   *   based purely on synthesized RemoteEvents.
   *
   * @param queryResult.documents - The documents that match the query according
   * to the LocalStore.
   * @param queryResult.remoteKeys - The keys of the documents that match the
   * query according to the backend.
   *
   * @returns The ViewChange that resulted from this synchronization.
   */
  // PORTING NOTE: Multi-tab only.
  Oa(e) {
    this.fa = e.gs, this.pa = q();
    const t = this.ba(e.documents);
    return this.applyChanges(
      t,
      /* limboResolutionEnabled= */
      !0
    );
  }
  /**
   * Returns a view snapshot as if this query was just listened to. Contains
   * a document add for every existing document and the `fromCache` and
   * `hasPendingWrites` status of the already established view.
   */
  // PORTING NOTE: Multi-tab only.
  Na() {
    return cn.fromInitialDocuments(this.query, this.wa, this.mutatedKeys, this.ga === 0, this.hasCachedResults);
  }
}
const Po = "SyncEngine";
class By {
  constructor(e, t, r) {
    this.query = e, this.targetId = t, this.view = r;
  }
}
class jy {
  constructor(e) {
    this.key = e, /**
     * Set to true once we've received a document. This is used in
     * getRemoteKeysForTarget() and ultimately used by WatchChangeAggregator to
     * decide whether it needs to manufacture a delete event for the target once
     * the target is CURRENT.
     */
    this.Ba = !1;
  }
}
class qy {
  constructor(e, t, r, s, o, a) {
    this.localStore = e, this.remoteStore = t, this.eventManager = r, this.sharedClientState = s, this.currentUser = o, this.maxConcurrentLimboResolutions = a, this.La = {}, this.ka = new Ft((u) => Vl(u), Ps), this.qa = /* @__PURE__ */ new Map(), /**
     * The keys of documents that are in limbo for which we haven't yet started a
     * limbo resolution query. The strings in this set are the result of calling
     * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
     *
     * The `Set` type was chosen because it provides efficient lookup and removal
     * of arbitrary elements and it also maintains insertion order, providing the
     * desired queue-like FIFO semantics.
     */
    this.Qa = /* @__PURE__ */ new Set(), /**
     * Keeps track of the target ID for each document that is in limbo with an
     * active target.
     */
    this.$a = new Y(L.comparator), /**
     * Keeps track of the information about an active limbo resolution for each
     * active target ID that was started for the purpose of limbo resolution.
     */
    this.Ua = /* @__PURE__ */ new Map(), this.Ka = new go(), /** Stores user completion handlers, indexed by User and BatchId. */
    this.Wa = {}, /** Stores user callbacks waiting for all pending writes to be acknowledged. */
    this.Ga = /* @__PURE__ */ new Map(), this.za = an.Kn(), this.onlineState = "Unknown", // The primary state is set to `true` or `false` immediately after Firestore
    // startup. In the interim, a client should only be considered primary if
    // `isPrimary` is true.
    this.ja = void 0;
  }
  get isPrimaryClient() {
    return this.ja === !0;
  }
}
async function $y(n, e, t = !0) {
  const r = Th(n);
  let s;
  const o = r.ka.get(e);
  return o ? (
    // PORTING NOTE: With Multi-Tab Web, it is possible that a query view
    // already exists when EventManager calls us for the first time. This
    // happens when the primary tab is already listening to this query on
    // behalf of another tab and the user of the primary also starts listening
    // to the query. EventManager will not have an assigned target ID in this
    // case and calls `listen` to obtain this ID.
    (r.sharedClientState.addLocalQueryTarget(o.targetId), s = o.view.Na())
  ) : s = await gh(
    r,
    e,
    t,
    /** shouldInitializeView= */
    !0
  ), s;
}
async function zy(n, e) {
  const t = Th(n);
  await gh(
    t,
    e,
    /** shouldListenToRemote= */
    !0,
    /** shouldInitializeView= */
    !1
  );
}
async function gh(n, e, t, r) {
  const s = await ly(n.localStore, Ue(e)), o = s.targetId, a = n.sharedClientState.addLocalQueryTarget(o, t);
  let u;
  return r && (u = await Hy(n, e, o, a === "current", s.resumeToken)), n.isPrimaryClient && t && ih(n.remoteStore, s), u;
}
async function Hy(n, e, t, r, s) {
  n.Ha = (y, w, P) => async function(N, V, K, z) {
    let H = V.view.ba(K);
    H.ls && // The query has a limit and some docs were removed, so we need
    // to re-run the query against the local store to make sure we
    // didn't lose any good docs that had been past the limit.
    (H = await Qc(
      N.localStore,
      V.query,
      /* usePreviousResults= */
      !1
    ).then(({ documents: E }) => V.view.ba(E, H)));
    const ee = z && z.targetChanges.get(V.targetId), Ce = z && z.targetMismatches.get(V.targetId) != null, te = V.view.applyChanges(
      H,
      /* limboResolutionEnabled= */
      N.isPrimaryClient,
      ee,
      Ce
    );
    return iu(N, V.targetId, te.Ma), te.snapshot;
  }(n, y, w, P);
  const o = await Qc(
    n.localStore,
    e,
    /* usePreviousResults= */
    !0
  ), a = new Fy(e, o.gs), u = a.ba(o.documents), l = lr.createSynthesizedTargetChangeForCurrentChange(t, r && n.onlineState !== "Offline", s), d = a.applyChanges(
    u,
    /* limboResolutionEnabled= */
    n.isPrimaryClient,
    l
  );
  iu(n, t, d.Ma);
  const p = new By(e, t, a);
  return n.ka.set(e, p), n.qa.has(t) ? n.qa.get(t).push(e) : n.qa.set(t, [e]), d.snapshot;
}
async function Wy(n, e, t) {
  const r = F(n), s = r.ka.get(e), o = r.qa.get(s.targetId);
  if (o.length > 1) return r.qa.set(s.targetId, o.filter((a) => !Ps(a, e))), void r.ka.delete(e);
  r.isPrimaryClient ? (r.sharedClientState.removeLocalQueryTarget(s.targetId), r.sharedClientState.isActiveQueryTarget(s.targetId) || await Fi(
    r.localStore,
    s.targetId,
    /*keepPersistedTargetData=*/
    !1
  ).then(() => {
    r.sharedClientState.clearQueryState(s.targetId), t && Eo(r.remoteStore, s.targetId), qi(r, s.targetId);
  }).catch(mn)) : (qi(r, s.targetId), await Fi(
    r.localStore,
    s.targetId,
    /*keepPersistedTargetData=*/
    !0
  ));
}
async function Ky(n, e) {
  const t = F(n), r = t.ka.get(e), s = t.qa.get(r.targetId);
  t.isPrimaryClient && s.length === 1 && // PORTING NOTE: Unregister the target ID with local Firestore client as
  // watch target.
  (t.sharedClientState.removeLocalQueryTarget(r.targetId), Eo(t.remoteStore, r.targetId));
}
async function Gy(n, e, t) {
  const r = tv(n);
  try {
    const s = await function(a, u) {
      const l = F(a), d = ie.now(), p = u.reduce((P, k) => P.add(k.key), q());
      let y, w;
      return l.persistence.runTransaction("Locally write mutations", "readwrite", (P) => {
        let k = Ze(), N = q();
        return l.ds.getEntries(P, p).next((V) => {
          k = V, k.forEach((K, z) => {
            z.isValidDocument() || (N = N.add(K));
          });
        }).next(() => l.localDocuments.getOverlayedDocuments(P, k)).next((V) => {
          y = V;
          const K = [];
          for (const z of u) {
            const H = l_(z, y.get(z.key).overlayedDocument);
            H != null && // NOTE: The base state should only be applied if there's some
            // existing document to override, so use a Precondition of
            // exists=true
            K.push(new Rt(z.key, H, Al(H.value.mapValue), De.exists(!0)));
          }
          return l.mutationQueue.addMutationBatch(P, d, K, u);
        }).next((V) => {
          w = V;
          const K = V.applyToLocalDocumentSet(y, N);
          return l.documentOverlayCache.saveOverlays(P, V.batchId, K);
        });
      }).then(() => ({
        batchId: w.batchId,
        changes: Ol(y)
      }));
    }(r.localStore, e);
    r.sharedClientState.addPendingMutation(s.batchId), function(a, u, l) {
      let d = a.Wa[a.currentUser.toKey()];
      d || (d = new Y(B)), d = d.insert(u, l), a.Wa[a.currentUser.toKey()] = d;
    }(r, s.batchId, t), await dr(r, s.changes), await Os(r.remoteStore);
  } catch (s) {
    const o = Ro(s, "Failed to persist write");
    t.reject(o);
  }
}
async function _h(n, e) {
  const t = F(n);
  try {
    const r = await ay(t.localStore, e);
    e.targetChanges.forEach((s, o) => {
      const a = t.Ua.get(o);
      a && // Since this is a limbo resolution lookup, it's for a single document
      // and it could be added, modified, or removed, but not a combination.
      (G(s.addedDocuments.size + s.modifiedDocuments.size + s.removedDocuments.size <= 1), s.addedDocuments.size > 0 ? a.Ba = !0 : s.modifiedDocuments.size > 0 ? G(a.Ba) : s.removedDocuments.size > 0 && (G(a.Ba), a.Ba = !1));
    }), await dr(t, r, e);
  } catch (r) {
    await mn(r);
  }
}
function su(n, e, t) {
  const r = F(n);
  if (r.isPrimaryClient && t === 0 || !r.isPrimaryClient && t === 1) {
    const s = [];
    r.ka.forEach((o, a) => {
      const u = a.view.sa(e);
      u.snapshot && s.push(u.snapshot);
    }), function(a, u) {
      const l = F(a);
      l.onlineState = u;
      let d = !1;
      l.queries.forEach((p, y) => {
        for (const w of y.ta)
          w.sa(u) && (d = !0);
      }), d && So(l);
    }(r.eventManager, e), s.length && r.La.p_(s), r.onlineState = e, r.isPrimaryClient && r.sharedClientState.setOnlineState(e);
  }
}
async function Qy(n, e, t) {
  const r = F(n);
  r.sharedClientState.updateQueryState(e, "rejected", t);
  const s = r.Ua.get(e), o = s && s.key;
  if (o) {
    let a = new Y(L.comparator);
    a = a.insert(o, ve.newNoDocument(o, U.min()));
    const u = q().add(o), l = new Vs(
      U.min(),
      /* targetChanges= */
      /* @__PURE__ */ new Map(),
      /* targetMismatches= */
      new Y(B),
      a,
      u
    );
    await _h(r, l), // Since this query failed, we won't want to manually unlisten to it.
    // We only remove it from bookkeeping after we successfully applied the
    // RemoteEvent. If `applyRemoteEvent()` throws, we want to re-listen to
    // this query when the RemoteStore restarts the Watch stream, which should
    // re-trigger the target failure.
    r.$a = r.$a.remove(o), r.Ua.delete(e), Co(r);
  } else await Fi(
    r.localStore,
    e,
    /* keepPersistedTargetData */
    !1
  ).then(() => qi(r, e, t)).catch(mn);
}
async function Jy(n, e) {
  const t = F(n), r = e.batch.batchId;
  try {
    const s = await oy(t.localStore, e);
    vh(
      t,
      r,
      /*error=*/
      null
    ), yh(t, r), t.sharedClientState.updateMutationState(r, "acknowledged"), await dr(t, s);
  } catch (s) {
    await mn(s);
  }
}
async function Xy(n, e, t) {
  const r = F(n);
  try {
    const s = await function(a, u) {
      const l = F(a);
      return l.persistence.runTransaction("Reject batch", "readwrite-primary", (d) => {
        let p;
        return l.mutationQueue.lookupMutationBatch(d, u).next((y) => (G(y !== null), p = y.keys(), l.mutationQueue.removeMutationBatch(d, y))).next(() => l.mutationQueue.performConsistencyCheck(d)).next(() => l.documentOverlayCache.removeOverlaysForBatchId(d, p, u)).next(() => l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d, p)).next(() => l.localDocuments.getDocuments(d, p));
      });
    }(r.localStore, e);
    vh(r, e, t), yh(r, e), r.sharedClientState.updateMutationState(e, "rejected", t), await dr(r, s);
  } catch (s) {
    await mn(s);
  }
}
function yh(n, e) {
  (n.Ga.get(e) || []).forEach((t) => {
    t.resolve();
  }), n.Ga.delete(e);
}
function vh(n, e, t) {
  const r = F(n);
  let s = r.Wa[r.currentUser.toKey()];
  if (s) {
    const o = s.get(e);
    o && (t ? o.reject(t) : o.resolve(), s = s.remove(e)), r.Wa[r.currentUser.toKey()] = s;
  }
}
function qi(n, e, t = null) {
  n.sharedClientState.removeLocalQueryTarget(e);
  for (const r of n.qa.get(e)) n.ka.delete(r), t && n.La.Ja(r, t);
  n.qa.delete(e), n.isPrimaryClient && n.Ka.br(e).forEach((r) => {
    n.Ka.containsKey(r) || // We removed the last reference for this key
    Eh(n, r);
  });
}
function Eh(n, e) {
  n.Qa.delete(e.path.canonicalString());
  const t = n.$a.get(e);
  t !== null && (Eo(n.remoteStore, t), n.$a = n.$a.remove(e), n.Ua.delete(t), Co(n));
}
function iu(n, e, t) {
  for (const r of t) r instanceof ph ? (n.Ka.addReference(r.key, e), Yy(n, r)) : r instanceof mh ? (D(Po, "Document no longer in limbo: " + r.key), n.Ka.removeReference(r.key, e), n.Ka.containsKey(r.key) || // We removed the last reference for this key
  Eh(n, r.key)) : x();
}
function Yy(n, e) {
  const t = e.key, r = t.path.canonicalString();
  n.$a.get(t) || n.Qa.has(r) || (D(Po, "New document in limbo: " + t), n.Qa.add(r), Co(n));
}
function Co(n) {
  for (; n.Qa.size > 0 && n.$a.size < n.maxConcurrentLimboResolutions; ) {
    const e = n.Qa.values().next().value;
    n.Qa.delete(e);
    const t = new L(X.fromString(e)), r = n.za.next();
    n.Ua.set(r, new jy(t)), n.$a = n.$a.insert(t, r), ih(n.remoteStore, new lt(Ue(uo(t.path)), r, "TargetPurposeLimboResolution", ws.ae));
  }
}
async function dr(n, e, t) {
  const r = F(n), s = [], o = [], a = [];
  r.ka.isEmpty() || (r.ka.forEach((u, l) => {
    a.push(r.Ha(l, e, t).then((d) => {
      var p;
      if ((d || t) && r.isPrimaryClient) {
        const y = d ? !d.fromCache : (p = t == null ? void 0 : t.targetChanges.get(l.targetId)) === null || p === void 0 ? void 0 : p.current;
        r.sharedClientState.updateQueryState(l.targetId, y ? "current" : "not-current");
      }
      if (d) {
        s.push(d);
        const y = yo.Yi(l.targetId, d);
        o.push(y);
      }
    }));
  }), await Promise.all(a), r.La.p_(s), await async function(l, d) {
    const p = F(l);
    try {
      await p.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (y) => S.forEach(d, (w) => S.forEach(w.Hi, (P) => p.persistence.referenceDelegate.addReference(y, w.targetId, P)).next(() => S.forEach(w.Ji, (P) => p.persistence.referenceDelegate.removeReference(y, w.targetId, P)))));
    } catch (y) {
      if (!gn(y)) throw y;
      D(vo, "Failed to update sequence numbers: " + y);
    }
    for (const y of d) {
      const w = y.targetId;
      if (!y.fromCache) {
        const P = p.Ts.get(w), k = P.snapshotVersion, N = P.withLastLimboFreeSnapshotVersion(k);
        p.Ts = p.Ts.insert(w, N);
      }
    }
  }(r.localStore, o));
}
async function Zy(n, e) {
  const t = F(n);
  if (!t.currentUser.isEqual(e)) {
    D(Po, "User change. New user:", e.toKey());
    const r = await th(t.localStore, e);
    t.currentUser = e, // Fails tasks waiting for pending writes requested by previous user.
    function(o, a) {
      o.Ga.forEach((u) => {
        u.forEach((l) => {
          l.reject(new O(C.CANCELLED, a));
        });
      }), o.Ga.clear();
    }(t, "'waitForPendingWrites' promise is rejected due to a user change."), // TODO(b/114226417): Consider calling this only in the primary tab.
    t.sharedClientState.handleUserChange(e, r.removedBatchIds, r.addedBatchIds), await dr(t, r.Rs);
  }
}
function ev(n, e) {
  const t = F(n), r = t.Ua.get(e);
  if (r && r.Ba) return q().add(r.key);
  {
    let s = q();
    const o = t.qa.get(e);
    if (!o) return s;
    for (const a of o) {
      const u = t.ka.get(a);
      s = s.unionWith(u.view.Sa);
    }
    return s;
  }
}
function Th(n) {
  const e = F(n);
  return e.remoteStore.remoteSyncer.applyRemoteEvent = _h.bind(null, e), e.remoteStore.remoteSyncer.getRemoteKeysForTarget = ev.bind(null, e), e.remoteStore.remoteSyncer.rejectListen = Qy.bind(null, e), e.La.p_ = xy.bind(null, e.eventManager), e.La.Ja = Uy.bind(null, e.eventManager), e;
}
function tv(n) {
  const e = F(n);
  return e.remoteStore.remoteSyncer.applySuccessfulWrite = Jy.bind(null, e), e.remoteStore.remoteSyncer.rejectFailedWrite = Xy.bind(null, e), e;
}
class ps {
  constructor() {
    this.kind = "memory", this.synchronizeTabs = !1;
  }
  async initialize(e) {
    this.serializer = Ds(e.databaseInfo.databaseId), this.sharedClientState = this.Za(e), this.persistence = this.Xa(e), await this.persistence.start(), this.localStore = this.eu(e), this.gcScheduler = this.tu(e, this.localStore), this.indexBackfillerScheduler = this.nu(e, this.localStore);
  }
  tu(e, t) {
    return null;
  }
  nu(e, t) {
    return null;
  }
  eu(e) {
    return iy(this.persistence, new ny(), e.initialUser, this.serializer);
  }
  Xa(e) {
    return new eh(_o.ri, this.serializer);
  }
  Za(e) {
    return new dy();
  }
  async terminate() {
    var e, t;
    (e = this.gcScheduler) === null || e === void 0 || e.stop(), (t = this.indexBackfillerScheduler) === null || t === void 0 || t.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
  }
}
ps.provider = {
  build: () => new ps()
};
class nv extends ps {
  constructor(e) {
    super(), this.cacheSizeBytes = e;
  }
  tu(e, t) {
    G(this.persistence.referenceDelegate instanceof ds);
    const r = this.persistence.referenceDelegate.garbageCollector;
    return new j_(r, e.asyncQueue, t);
  }
  Xa(e) {
    const t = this.cacheSizeBytes !== void 0 ? we.withCacheSize(this.cacheSizeBytes) : we.DEFAULT;
    return new eh((r) => ds.ri(r, t), this.serializer);
  }
}
class $i {
  async initialize(e, t) {
    this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(
      t,
      /* startAsPrimary=*/
      !e.synchronizeTabs
    ), this.sharedClientState.onlineStateHandler = (r) => su(
      this.syncEngine,
      r,
      1
      /* OnlineStateSource.SharedClientState */
    ), this.remoteStore.remoteSyncer.handleCredentialChange = Zy.bind(null, this.syncEngine), await Oy(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(e) {
    return function() {
      return new My();
    }();
  }
  createDatastore(e) {
    const t = Ds(e.databaseInfo.databaseId), r = function(o) {
      return new _y(o);
    }(e.databaseInfo);
    return function(o, a, u, l) {
      return new Ty(o, a, u, l);
    }(e.authCredentials, e.appCheckCredentials, r, t);
  }
  createRemoteStore(e) {
    return function(r, s, o, a, u) {
      return new wy(r, s, o, a, u);
    }(this.localStore, this.datastore, e.asyncQueue, (t) => su(
      this.syncEngine,
      t,
      0
      /* OnlineStateSource.RemoteStore */
    ), function() {
      return Yc.D() ? new Yc() : new fy();
    }());
  }
  createSyncEngine(e, t) {
    return function(s, o, a, u, l, d, p) {
      const y = new qy(s, o, a, u, l, d);
      return p && (y.ja = !0), y;
    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
  }
  async terminate() {
    var e, t;
    await async function(s) {
      const o = F(s);
      D(xt, "RemoteStore shutting down."), o.W_.add(
        5
        /* OfflineCause.Shutdown */
      ), await hr(o), o.z_.shutdown(), // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
      // triggering spurious listener events with cached data, etc.
      o.j_.set(
        "Unknown"
        /* OnlineState.Unknown */
      );
    }(this.remoteStore), (e = this.datastore) === null || e === void 0 || e.terminate(), (t = this.eventManager) === null || t === void 0 || t.terminate();
  }
}
$i.provider = {
  build: () => new $i()
};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ih {
  constructor(e) {
    this.observer = e, /**
     * When set to true, will not raise future events. Necessary to deal with
     * async detachment of listener.
     */
    this.muted = !1;
  }
  next(e) {
    this.muted || this.observer.next && this.iu(this.observer.next, e);
  }
  error(e) {
    this.muted || (this.observer.error ? this.iu(this.observer.error, e) : Ye("Uncaught Error in snapshot listener:", e.toString()));
  }
  su() {
    this.muted = !0;
  }
  iu(e, t) {
    setTimeout(() => {
      this.muted || e(t);
    }, 0);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const It = "FirestoreClient";
class rv {
  constructor(e, t, r, s, o) {
    this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = r, this.databaseInfo = s, this.user = ye.UNAUTHENTICATED, this.clientId = pl.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this._uninitializedComponentsProvider = o, this.authCredentials.start(r, async (a) => {
      D(It, "Received user=", a.uid), await this.authCredentialListener(a), this.user = a;
    }), this.appCheckCredentials.start(r, (a) => (D(It, "Received new app check token=", a), this.appCheckCredentialListener(a, this.user)));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this.databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new Qe();
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
      try {
        this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), // The credentials provider must be terminated after shutting down the
        // RemoteStore as it will prevent the RemoteStore from retrieving auth
        // tokens.
        this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t) {
        const r = Ro(t, "Failed to shutdown persistence");
        e.reject(r);
      }
    }), e.promise;
  }
}
async function Ei(n, e) {
  n.asyncQueue.verifyOperationInProgress(), D(It, "Initializing OfflineComponentProvider");
  const t = n.configuration;
  await e.initialize(t);
  let r = t.initialUser;
  n.setCredentialChangeListener(async (s) => {
    r.isEqual(s) || (await th(e.localStore, s), r = s);
  }), // When a user calls clearPersistence() in one client, all other clients
  // need to be terminated to allow the delete to succeed.
  e.persistence.setDatabaseDeletedListener(() => n.terminate()), n._offlineComponents = e;
}
async function ou(n, e) {
  n.asyncQueue.verifyOperationInProgress();
  const t = await sv(n);
  D(It, "Initializing OnlineComponentProvider"), await e.initialize(t, n.configuration), // The CredentialChangeListener of the online component provider takes
  // precedence over the offline component provider.
  n.setCredentialChangeListener((r) => eu(e.remoteStore, r)), n.setAppCheckTokenChangeListener((r, s) => eu(e.remoteStore, s)), n._onlineComponents = e;
}
async function sv(n) {
  if (!n._offlineComponents) if (n._uninitializedComponentsProvider) {
    D(It, "Using user provided OfflineComponentProvider");
    try {
      await Ei(n, n._uninitializedComponentsProvider._offline);
    } catch (e) {
      const t = e;
      if (!function(s) {
        return s.name === "FirebaseError" ? s.code === C.FAILED_PRECONDITION || s.code === C.UNIMPLEMENTED : !(typeof DOMException < "u" && s instanceof DOMException) || // When the browser is out of quota we could get either quota exceeded
        // or an aborted error depending on whether the error happened during
        // schema migration.
        s.code === 22 || s.code === 20 || // Firefox Private Browsing mode disables IndexedDb and returns
        // INVALID_STATE for any usage.
        s.code === 11;
      }(t)) throw t;
      nn("Error using user provided cache. Falling back to memory cache: " + t), await Ei(n, new ps());
    }
  } else D(It, "Using default OfflineComponentProvider"), await Ei(n, new nv(void 0));
  return n._offlineComponents;
}
async function wh(n) {
  return n._onlineComponents || (n._uninitializedComponentsProvider ? (D(It, "Using user provided OnlineComponentProvider"), await ou(n, n._uninitializedComponentsProvider._online)) : (D(It, "Using default OnlineComponentProvider"), await ou(n, new $i()))), n._onlineComponents;
}
function iv(n) {
  return wh(n).then((e) => e.syncEngine);
}
async function Ah(n) {
  const e = await wh(n), t = e.eventManager;
  return t.onListen = $y.bind(null, e.syncEngine), t.onUnlisten = Wy.bind(null, e.syncEngine), t.onFirstRemoteStoreListen = zy.bind(null, e.syncEngine), t.onLastRemoteStoreUnlisten = Ky.bind(null, e.syncEngine), t;
}
function ov(n, e, t = {}) {
  const r = new Qe();
  return n.asyncQueue.enqueueAndForget(async () => function(o, a, u, l, d) {
    const p = new Ih({
      next: (w) => {
        p.su(), a.enqueueAndForget(() => dh(o, y));
        const P = w.docs.has(u);
        !P && w.fromCache ? (
          // TODO(dimond): If we're online and the document doesn't
          // exist then we resolve with a doc.exists set to false. If
          // we're offline however, we reject the Promise in this
          // case. Two options: 1) Cache the negative response from
          // the server so we can deliver that even when you're
          // offline 2) Actually reject the Promise in the online case
          // if the document doesn't exist.
          d.reject(new O(C.UNAVAILABLE, "Failed to get document because the client is offline."))
        ) : P && w.fromCache && l && l.source === "server" ? d.reject(new O(C.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : d.resolve(w);
      },
      error: (w) => d.reject(w)
    }), y = new fh(uo(u.path), p, {
      includeMetadataChanges: !0,
      Ta: !0
    });
    return hh(o, y);
  }(await Ah(n), n.asyncQueue, e, t, r)), r.promise;
}
function av(n, e, t = {}) {
  const r = new Qe();
  return n.asyncQueue.enqueueAndForget(async () => function(o, a, u, l, d) {
    const p = new Ih({
      next: (w) => {
        p.su(), a.enqueueAndForget(() => dh(o, y)), w.fromCache && l.source === "server" ? d.reject(new O(C.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : d.resolve(w);
      },
      error: (w) => d.reject(w)
    }), y = new fh(u, p, {
      includeMetadataChanges: !0,
      Ta: !0
    });
    return hh(o, y);
  }(await Ah(n), n.asyncQueue, e, t, r)), r.promise;
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Rh(n) {
  const e = {};
  return n.timeoutSeconds !== void 0 && (e.timeoutSeconds = n.timeoutSeconds), e;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const au = /* @__PURE__ */ new Map();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Sh(n, e, t) {
  if (!t) throw new O(C.INVALID_ARGUMENT, `Function ${n}() cannot be called with an empty ${e}.`);
}
function cv(n, e, t, r) {
  if (e === !0 && r === !0) throw new O(C.INVALID_ARGUMENT, `${n} and ${t} cannot be used together.`);
}
function cu(n) {
  if (!L.isDocumentKey(n)) throw new O(C.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`);
}
function uu(n) {
  if (L.isDocumentKey(n)) throw new O(C.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`);
}
function bo(n) {
  if (n === void 0) return "undefined";
  if (n === null) return "null";
  if (typeof n == "string") return n.length > 20 && (n = `${n.substring(0, 20)}...`), JSON.stringify(n);
  if (typeof n == "number" || typeof n == "boolean") return "" + n;
  if (typeof n == "object") {
    if (n instanceof Array) return "an array";
    {
      const e = (
        /** try to get the constructor name for an object. */
        function(r) {
          return r.constructor ? r.constructor.name : null;
        }(n)
      );
      return e ? `a custom ${e} object` : "an object";
    }
  }
  return typeof n == "function" ? "a function" : x();
}
function qe(n, e) {
  if ("_delegate" in n && // Unwrap Compat types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (n = n._delegate), !(n instanceof e)) {
    if (e.name === n.constructor.name) throw new O(C.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const t = bo(n);
      throw new O(C.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${t}`);
    }
  }
  return n;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ph = "firestore.googleapis.com", lu = !0;
class hu {
  constructor(e) {
    var t, r;
    if (e.host === void 0) {
      if (e.ssl !== void 0) throw new O(C.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = Ph, this.ssl = lu;
    } else this.host = e.host, this.ssl = (t = e.ssl) !== null && t !== void 0 ? t : lu;
    if (this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, e.cacheSizeBytes === void 0) this.cacheSizeBytes = Zl;
    else {
      if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < F_) throw new O(C.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    cv("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = !1 : e.experimentalAutoDetectLongPolling === void 0 ? this.experimentalAutoDetectLongPolling = !0 : (
      // For backwards compatibility, coerce the value to boolean even though
      // the TypeScript compiler has narrowed the type to boolean already.
      // noinspection PointlessBooleanExpressionJS
      this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling
    ), this.experimentalLongPollingOptions = Rh((r = e.experimentalLongPollingOptions) !== null && r !== void 0 ? r : {}), function(o) {
      if (o.timeoutSeconds !== void 0) {
        if (isNaN(o.timeoutSeconds)) throw new O(C.INVALID_ARGUMENT, `invalid long polling timeout: ${o.timeoutSeconds} (must not be NaN)`);
        if (o.timeoutSeconds < 5) throw new O(C.INVALID_ARGUMENT, `invalid long polling timeout: ${o.timeoutSeconds} (minimum allowed value is 5)`);
        if (o.timeoutSeconds > 30) throw new O(C.INVALID_ARGUMENT, `invalid long polling timeout: ${o.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function(r, s) {
      return r.timeoutSeconds === s.timeoutSeconds;
    }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
}
class Ls {
  /** @hideconstructor */
  constructor(e, t, r, s) {
    this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = r, this._app = s, /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new hu({}), this._settingsFrozen = !1, this._emulatorOptions = {}, // A task that is assigned when the terminate() is invoked and resolved when
    // all components have shut down. Otherwise, Firestore is not terminated,
    // which can mean either the FirestoreClient is in the process of starting,
    // or restarting.
    this._terminateTask = "notTerminated";
  }
  /**
   * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
   * instance.
   */
  get app() {
    if (!this._app) throw new O(C.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return this._terminateTask !== "notTerminated";
  }
  _setSettings(e) {
    if (this._settingsFrozen) throw new O(C.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new hu(e), this._emulatorOptions = e.emulatorOptions || {}, e.credentials !== void 0 && (this._authCredentials = function(r) {
      if (!r) return new mg();
      switch (r.type) {
        case "firstParty":
          return new vg(r.sessionIndex || "0", r.iamToken || null, r.authTokenFactory || null);
        case "provider":
          return r.client;
        default:
          throw new O(C.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _getEmulatorOptions() {
    return this._emulatorOptions;
  }
  _freezeSettings() {
    return this._settingsFrozen = !0, this._settings;
  }
  _delete() {
    return this._terminateTask === "notTerminated" && (this._terminateTask = this._terminate()), this._terminateTask;
  }
  async _restart() {
    this._terminateTask === "notTerminated" ? await this._terminate() : this._terminateTask = "notTerminated";
  }
  /** Returns a JSON-serializable representation of this `Firestore` instance. */
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  /**
   * Terminates all components used by this client. Subclasses can override
   * this method to clean up their own dependencies, but must also call this
   * method.
   *
   * Only ever called once.
   */
  _terminate() {
    return function(t) {
      const r = au.get(t);
      r && (D("ComponentProvider", "Removing Datastore"), au.delete(t), r.terminate());
    }(this), Promise.resolve();
  }
}
function Ch(n, e, t, r = {}) {
  var s;
  const o = (n = qe(n, Ls))._getSettings(), a = Object.assign(Object.assign({}, o), {
    emulatorOptions: n._getEmulatorOptions()
  }), u = `${e}:${t}`;
  o.host !== Ph && o.host !== u && nn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
  const l = Object.assign(Object.assign({}, o), {
    host: u,
    ssl: !1,
    emulatorOptions: r
  });
  if (!Nt(l, a) && (n._setSettings(l), r.mockUserToken)) {
    let d, p;
    if (typeof r.mockUserToken == "string") d = r.mockUserToken, p = ye.MOCK_USER;
    else {
      d = kd(r.mockUserToken, (s = n._app) === null || s === void 0 ? void 0 : s.options.projectId);
      const y = r.mockUserToken.sub || r.mockUserToken.user_id;
      if (!y) throw new O(C.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
      p = new ye(y);
    }
    n._authCredentials = new gg(new dl(d, p));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ms {
  // This is the lite version of the Query class in the main SDK.
  /** @hideconstructor protected */
  constructor(e, t, r) {
    this.converter = t, this._query = r, /** The type of this Firestore reference. */
    this.type = "query", this.firestore = e;
  }
  withConverter(e) {
    return new Ms(this.firestore, e, this._query);
  }
}
class Re {
  /** @hideconstructor */
  constructor(e, t, r) {
    this.converter = t, this._key = r, /** The type of this Firestore reference. */
    this.type = "document", this.firestore = e;
  }
  get _path() {
    return this._key.path;
  }
  /**
   * The document's identifier within its collection.
   */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  get path() {
    return this._key.path.canonicalString();
  }
  /**
   * The collection this `DocumentReference` belongs to.
   */
  get parent() {
    return new gt(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new Re(this.firestore, e, this._key);
  }
}
class gt extends Ms {
  /** @hideconstructor */
  constructor(e, t, r) {
    super(e, t, uo(r)), this._path = r, /** The type of this Firestore reference. */
    this.type = "collection";
  }
  /** The collection's identifier. */
  get id() {
    return this._query.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced collection (relative
   * to the root of the database).
   */
  get path() {
    return this._query.path.canonicalString();
  }
  /**
   * A reference to the containing `DocumentReference` if this is a
   * subcollection. If this isn't a subcollection, the reference is null.
   */
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new Re(
      this.firestore,
      /* converter= */
      null,
      new L(e)
    );
  }
  withConverter(e) {
    return new gt(this.firestore, e, this._path);
  }
}
function un(n, e, ...t) {
  if (n = he(n), Sh("collection", "path", e), n instanceof Ls) {
    const r = X.fromString(e, ...t);
    return uu(r), new gt(
      n,
      /* converter= */
      null,
      r
    );
  }
  {
    if (!(n instanceof Re || n instanceof gt)) throw new O(C.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = n._path.child(X.fromString(e, ...t));
    return uu(r), new gt(
      n.firestore,
      /* converter= */
      null,
      r
    );
  }
}
function Ne(n, e, ...t) {
  if (n = he(n), // We allow omission of 'pathString' but explicitly prohibit passing in both
  // 'undefined' and 'null'.
  arguments.length === 1 && (e = pl.newId()), Sh("doc", "path", e), n instanceof Ls) {
    const r = X.fromString(e, ...t);
    return cu(r), new Re(
      n,
      /* converter= */
      null,
      new L(r)
    );
  }
  {
    if (!(n instanceof Re || n instanceof gt)) throw new O(C.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = n._path.child(X.fromString(e, ...t));
    return cu(r), new Re(n.firestore, n instanceof gt ? n.converter : null, new L(r));
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const du = "AsyncQueue";
class fu {
  constructor(e = Promise.resolve()) {
    this.Vu = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
    // be changed again.
    this.mu = !1, // Operations scheduled to be queued in the future. Operations are
    // automatically removed after they are run or canceled.
    this.fu = [], // visible for testing
    this.gu = null, // Flag set while there's an outstanding AsyncQueue operation, used for
    // assertion sanity-checks.
    this.pu = !1, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
    this.yu = !1, // List of TimerIds to fast-forward delays for.
    this.wu = [], // Backoff timer used to schedule retries for retryable operations
    this.a_ = new rh(
      this,
      "async_queue_retry"
      /* TimerId.AsyncQueueRetry */
    ), // Visibility handler that triggers an immediate retry of all retryable
    // operations. Meant to speed up recovery when we regain file system access
    // after page comes into foreground.
    this.Su = () => {
      const r = vi();
      r && D(du, "Visibility state changed to " + r.visibilityState), this.a_.t_();
    }, this.bu = e;
    const t = vi();
    t && typeof t.addEventListener == "function" && t.addEventListener("visibilitychange", this.Su);
  }
  get isShuttingDown() {
    return this.mu;
  }
  /**
   * Adds a new operation to the queue without waiting for it to complete (i.e.
   * we ignore the Promise result).
   */
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.Du(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.vu(e);
  }
  enterRestrictedMode(e) {
    if (!this.mu) {
      this.mu = !0, this.yu = e || !1;
      const t = vi();
      t && typeof t.removeEventListener == "function" && t.removeEventListener("visibilitychange", this.Su);
    }
  }
  enqueue(e) {
    if (this.Du(), this.mu)
      return new Promise(() => {
      });
    const t = new Qe();
    return this.vu(() => this.mu && this.yu ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)).then(() => t.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.Vu.push(e), this.Cu()));
  }
  /**
   * Runs the next operation from the retryable queue. If the operation fails,
   * reschedules with backoff.
   */
  async Cu() {
    if (this.Vu.length !== 0) {
      try {
        await this.Vu[0](), this.Vu.shift(), this.a_.reset();
      } catch (e) {
        if (!gn(e)) throw e;
        D(du, "Operation failed with retryable error: " + e);
      }
      this.Vu.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
      // This is necessary to run retryable operations that failed during
      // their initial attempt since we don't know whether they are already
      // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
      // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
      // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
      // call scheduled here.
      // Since `backoffAndRun()` cancels an existing backoff and schedules a
      // new backoff on every call, there is only ever a single additional
      // operation in the queue.
      this.a_.Xo(() => this.Cu());
    }
  }
  vu(e) {
    const t = this.bu.then(() => (this.pu = !0, e().catch((r) => {
      this.gu = r, this.pu = !1;
      const s = (
        /**
        * Chrome includes Error.message in Error.stack. Other browsers do not.
        * This returns expected output of message + stack when available.
        * @param error - Error or FirestoreError
        */
        function(a) {
          let u = a.message || "";
          return a.stack && (u = a.stack.includes(a.message) ? a.stack : a.message + `
` + a.stack), u;
        }(r)
      );
      throw Ye("INTERNAL UNHANDLED ERROR: ", s), r;
    }).then((r) => (this.pu = !1, r))));
    return this.bu = t, t;
  }
  enqueueAfterDelay(e, t, r) {
    this.Du(), // Fast-forward delays for timerIds that have been overridden.
    this.wu.indexOf(e) > -1 && (t = 0);
    const s = Ao.createAndSchedule(this, e, t, r, (o) => this.Fu(o));
    return this.fu.push(s), s;
  }
  Du() {
    this.gu && x();
  }
  verifyOperationInProgress() {
  }
  /**
   * Waits until all currently queued tasks are finished executing. Delayed
   * operations are not run.
   */
  async Mu() {
    let e;
    do
      e = this.bu, await e;
    while (e !== this.bu);
  }
  /**
   * For Tests: Determine if a delayed operation with a particular TimerId
   * exists.
   */
  xu(e) {
    for (const t of this.fu) if (t.timerId === e) return !0;
    return !1;
  }
  /**
   * For Tests: Runs some or all delayed operations early.
   *
   * @param lastTimerId - Delayed operations up to and including this TimerId
   * will be drained. Pass TimerId.All to run all delayed operations.
   * @returns a Promise that resolves once all operations have been run.
   */
  Ou(e) {
    return this.Mu().then(() => {
      this.fu.sort((t, r) => t.targetTimeMs - r.targetTimeMs);
      for (const t of this.fu) if (t.skipDelay(), e !== "all" && t.timerId === e) break;
      return this.Mu();
    });
  }
  /**
   * For Tests: Skip all subsequent delays for a timer id.
   */
  Nu(e) {
    this.wu.push(e);
  }
  /** Called once a DelayedOperation is run or canceled. */
  Fu(e) {
    const t = this.fu.indexOf(e);
    this.fu.splice(t, 1);
  }
}
class yn extends Ls {
  /** @hideconstructor */
  constructor(e, t, r, s) {
    super(e, t, r, s), /**
     * Whether it's a {@link Firestore} or Firestore Lite instance.
     */
    this.type = "firestore", this._queue = new fu(), this._persistenceKey = (s == null ? void 0 : s.name) || "[DEFAULT]";
  }
  async _terminate() {
    if (this._firestoreClient) {
      const e = this._firestoreClient.terminate();
      this._queue = new fu(e), this._firestoreClient = void 0, await e;
    }
  }
}
function uv(n, e) {
  const t = typeof n == "object" ? n : Gi(), r = typeof n == "string" ? n : is, s = Ki(t, "firestore").getImmediate({
    identifier: r
  });
  if (!s._initialized) {
    const o = Cd("firestore");
    o && Ch(s, ...o);
  }
  return s;
}
function ko(n) {
  if (n._terminated) throw new O(C.FAILED_PRECONDITION, "The client has already been terminated.");
  return n._firestoreClient || lv(n), n._firestoreClient;
}
function lv(n) {
  var e, t, r;
  const s = n._freezeSettings(), o = function(u, l, d, p) {
    return new Og(u, l, d, p.host, p.ssl, p.experimentalForceLongPolling, p.experimentalAutoDetectLongPolling, Rh(p.experimentalLongPollingOptions), p.useFetchStreams);
  }(n._databaseId, ((e = n._app) === null || e === void 0 ? void 0 : e.options.appId) || "", n._persistenceKey, s);
  n._componentsProvider || !((t = s.localCache) === null || t === void 0) && t._offlineComponentProvider && (!((r = s.localCache) === null || r === void 0) && r._onlineComponentProvider) && (n._componentsProvider = {
    _offline: s.localCache._offlineComponentProvider,
    _online: s.localCache._onlineComponentProvider
  }), n._firestoreClient = new rv(n._authCredentials, n._appCheckCredentials, n._queue, o, n._componentsProvider && function(u) {
    const l = u == null ? void 0 : u._online.build();
    return {
      _offline: u == null ? void 0 : u._offline.build(l),
      _online: l
    };
  }(n._componentsProvider));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ln {
  /** @hideconstructor */
  constructor(e) {
    this._byteString = e;
  }
  /**
   * Creates a new `Bytes` object from the given Base64 string, converting it to
   * bytes.
   *
   * @param base64 - The Base64 string used to create the `Bytes` object.
   */
  static fromBase64String(e) {
    try {
      return new ln(de.fromBase64String(e));
    } catch (t) {
      throw new O(C.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t);
    }
  }
  /**
   * Creates a new `Bytes` object from the given Uint8Array.
   *
   * @param array - The Uint8Array used to create the `Bytes` object.
   */
  static fromUint8Array(e) {
    return new ln(de.fromUint8Array(e));
  }
  /**
   * Returns the underlying bytes as a Base64-encoded string.
   *
   * @returns The Base64-encoded string created from the `Bytes` object.
   */
  toBase64() {
    return this._byteString.toBase64();
  }
  /**
   * Returns the underlying bytes in a new `Uint8Array`.
   *
   * @returns The Uint8Array created from the `Bytes` object.
   */
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  /**
   * Returns a string representation of the `Bytes` object.
   *
   * @returns A string representation of the `Bytes` object.
   */
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  /**
   * Returns true if this `Bytes` object is equal to the provided one.
   *
   * @param other - The `Bytes` object to compare against.
   * @returns true if this `Bytes` object is equal to the provided one.
   */
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xs {
  /**
   * Creates a `FieldPath` from the provided field names. If more than one field
   * name is provided, the path will point to a nested field in a document.
   *
   * @param fieldNames - A list of field names.
   */
  constructor(...e) {
    for (let t = 0; t < e.length; ++t) if (e[t].length === 0) throw new O(C.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new le(e);
  }
  /**
   * Returns true if this `FieldPath` is equal to the provided one.
   *
   * @param other - The `FieldPath` to compare against.
   * @returns true if this `FieldPath` is equal to the provided one.
   */
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Vo {
  /**
   * @param _methodName - The public API endpoint that returns this class.
   * @hideconstructor
   */
  constructor(e) {
    this._methodName = e;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Do {
  /**
   * Creates a new immutable `GeoPoint` object with the provided latitude and
   * longitude values.
   * @param latitude - The latitude as number between -90 and 90.
   * @param longitude - The longitude as number between -180 and 180.
   */
  constructor(e, t) {
    if (!isFinite(e) || e < -90 || e > 90) throw new O(C.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
    if (!isFinite(t) || t < -180 || t > 180) throw new O(C.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
    this._lat = e, this._long = t;
  }
  /**
   * The latitude of this `GeoPoint` instance.
   */
  get latitude() {
    return this._lat;
  }
  /**
   * The longitude of this `GeoPoint` instance.
   */
  get longitude() {
    return this._long;
  }
  /**
   * Returns true if this `GeoPoint` is equal to the provided one.
   *
   * @param other - The `GeoPoint` to compare against.
   * @returns true if this `GeoPoint` is equal to the provided one.
   */
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  /** Returns a JSON-serializable representation of this GeoPoint. */
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long
    };
  }
  /**
   * Actually private to JS consumers of our API, so this function is prefixed
   * with an underscore.
   */
  _compareTo(e) {
    return B(this._lat, e._lat) || B(this._long, e._long);
  }
}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class No {
  /**
   * @private
   * @internal
   */
  constructor(e) {
    this._values = (e || []).map((t) => t);
  }
  /**
   * Returns a copy of the raw number array form of the vector.
   */
  toArray() {
    return this._values.map((e) => e);
  }
  /**
   * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
   */
  isEqual(e) {
    return function(r, s) {
      if (r.length !== s.length) return !1;
      for (let o = 0; o < r.length; ++o) if (r[o] !== s[o]) return !1;
      return !0;
    }(this._values, e._values);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const hv = /^__.*__$/;
class dv {
  constructor(e, t, r) {
    this.data = e, this.fieldMask = t, this.fieldTransforms = r;
  }
  toMutation(e, t) {
    return this.fieldMask !== null ? new Rt(e, this.data, this.fieldMask, t, this.fieldTransforms) : new ur(e, this.data, t, this.fieldTransforms);
  }
}
class bh {
  constructor(e, t, r) {
    this.data = e, this.fieldMask = t, this.fieldTransforms = r;
  }
  toMutation(e, t) {
    return new Rt(e, this.data, this.fieldMask, t, this.fieldTransforms);
  }
}
function kh(n) {
  switch (n) {
    case 0:
    case 2:
    case 1:
      return !0;
    case 3:
    case 4:
      return !1;
    default:
      throw x();
  }
}
class Oo {
  /**
   * Initializes a ParseContext with the given source and path.
   *
   * @param settings - The settings for the parser.
   * @param databaseId - The database ID of the Firestore instance.
   * @param serializer - The serializer to use to generate the Value proto.
   * @param ignoreUndefinedProperties - Whether to ignore undefined properties
   * rather than throw.
   * @param fieldTransforms - A mutable list of field transforms encountered
   * while parsing the data.
   * @param fieldMask - A mutable list of field paths encountered while parsing
   * the data.
   *
   * TODO(b/34871131): We don't support array paths right now, so path can be
   * null to indicate the context represents any location within an array (in
   * which case certain features will not work and errors will be somewhat
   * compromised).
   */
  constructor(e, t, r, s, o, a) {
    this.settings = e, this.databaseId = t, this.serializer = r, this.ignoreUndefinedProperties = s, // Minor hack: If fieldTransforms is undefined, we assume this is an
    // external call and we need to validate the entire path.
    o === void 0 && this.Bu(), this.fieldTransforms = o || [], this.fieldMask = a || [];
  }
  get path() {
    return this.settings.path;
  }
  get Lu() {
    return this.settings.Lu;
  }
  /** Returns a new context with the specified settings overwritten. */
  ku(e) {
    return new Oo(Object.assign(Object.assign({}, this.settings), e), this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
  }
  qu(e) {
    var t;
    const r = (t = this.path) === null || t === void 0 ? void 0 : t.child(e), s = this.ku({
      path: r,
      Qu: !1
    });
    return s.$u(e), s;
  }
  Uu(e) {
    var t;
    const r = (t = this.path) === null || t === void 0 ? void 0 : t.child(e), s = this.ku({
      path: r,
      Qu: !1
    });
    return s.Bu(), s;
  }
  Ku(e) {
    return this.ku({
      path: void 0,
      Qu: !0
    });
  }
  Wu(e) {
    return ms(e, this.settings.methodName, this.settings.Gu || !1, this.path, this.settings.zu);
  }
  /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
  contains(e) {
    return this.fieldMask.find((t) => e.isPrefixOf(t)) !== void 0 || this.fieldTransforms.find((t) => e.isPrefixOf(t.field)) !== void 0;
  }
  Bu() {
    if (this.path) for (let e = 0; e < this.path.length; e++) this.$u(this.path.get(e));
  }
  $u(e) {
    if (e.length === 0) throw this.Wu("Document fields must not be empty");
    if (kh(this.Lu) && hv.test(e)) throw this.Wu('Document fields cannot begin and end with "__"');
  }
}
class fv {
  constructor(e, t, r) {
    this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = r || Ds(e);
  }
  /** Creates a new top-level parse context. */
  ju(e, t, r, s = !1) {
    return new Oo({
      Lu: e,
      methodName: t,
      zu: r,
      path: le.emptyPath(),
      Qu: !1,
      Gu: s
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
  }
}
function Vh(n) {
  const e = n._freezeSettings(), t = Ds(n._databaseId);
  return new fv(n._databaseId, !!e.ignoreUndefinedProperties, t);
}
function pv(n, e, t, r, s, o = {}) {
  const a = n.ju(o.merge || o.mergeFields ? 2 : 0, e, t, s);
  Lo("Data must be an object, but it was:", a, r);
  const u = Dh(r, a);
  let l, d;
  if (o.merge) l = new Pe(a.fieldMask), d = a.fieldTransforms;
  else if (o.mergeFields) {
    const p = [];
    for (const y of o.mergeFields) {
      const w = zi(e, y, t);
      if (!a.contains(w)) throw new O(C.INVALID_ARGUMENT, `Field '${w}' is specified in your field mask but missing from your input data.`);
      Oh(p, w) || p.push(w);
    }
    l = new Pe(p), d = a.fieldTransforms.filter((y) => l.covers(y.field));
  } else l = null, d = a.fieldTransforms;
  return new dv(new Ae(u), l, d);
}
class Us extends Vo {
  _toFieldTransform(e) {
    if (e.Lu !== 2) throw e.Lu === 1 ? e.Wu(`${this._methodName}() can only appear at the top level of your update data`) : e.Wu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
    return e.fieldMask.push(e.path), null;
  }
  isEqual(e) {
    return e instanceof Us;
  }
}
function mv(n, e, t, r) {
  const s = n.ju(1, e, t);
  Lo("Data must be an object, but it was:", s, r);
  const o = [], a = Ae.empty();
  At(r, (l, d) => {
    const p = Mo(e, l, t);
    d = he(d);
    const y = s.Uu(p);
    if (d instanceof Us)
      o.push(p);
    else {
      const w = Fs(d, y);
      w != null && (o.push(p), a.set(p, w));
    }
  });
  const u = new Pe(o);
  return new bh(a, u, s.fieldTransforms);
}
function gv(n, e, t, r, s, o) {
  const a = n.ju(1, e, t), u = [zi(e, r, t)], l = [s];
  if (o.length % 2 != 0) throw new O(C.INVALID_ARGUMENT, `Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);
  for (let w = 0; w < o.length; w += 2) u.push(zi(e, o[w])), l.push(o[w + 1]);
  const d = [], p = Ae.empty();
  for (let w = u.length - 1; w >= 0; --w) if (!Oh(d, u[w])) {
    const P = u[w];
    let k = l[w];
    k = he(k);
    const N = a.Uu(P);
    if (k instanceof Us)
      d.push(P);
    else {
      const V = Fs(k, N);
      V != null && (d.push(P), p.set(P, V));
    }
  }
  const y = new Pe(d);
  return new bh(p, y, a.fieldTransforms);
}
function Fs(n, e) {
  if (Nh(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    n = he(n)
  )) return Lo("Unsupported field value:", e, n), Dh(n, e);
  if (n instanceof Vo)
    return function(r, s) {
      if (!kh(s.Lu)) throw s.Wu(`${r._methodName}() can only be used with update() and set()`);
      if (!s.path) throw s.Wu(`${r._methodName}() is not currently supported inside arrays`);
      const o = r._toFieldTransform(s);
      o && s.fieldTransforms.push(o);
    }(n, e), null;
  if (n === void 0 && e.ignoreUndefinedProperties)
    return null;
  if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    e.path && e.fieldMask.push(e.path), n instanceof Array
  ) {
    if (e.settings.Qu && e.Lu !== 4) throw e.Wu("Nested arrays are not supported");
    return function(r, s) {
      const o = [];
      let a = 0;
      for (const u of r) {
        let l = Fs(u, s.Ku(a));
        l == null && // Just include nulls in the array for fields being replaced with a
        // sentinel.
        (l = {
          nullValue: "NULL_VALUE"
        }), o.push(l), a++;
      }
      return {
        arrayValue: {
          values: o
        }
      };
    }(n, e);
  }
  return function(r, s) {
    if ((r = he(r)) === null) return {
      nullValue: "NULL_VALUE"
    };
    if (typeof r == "number") return s_(s.serializer, r);
    if (typeof r == "boolean") return {
      booleanValue: r
    };
    if (typeof r == "string") return {
      stringValue: r
    };
    if (r instanceof Date) {
      const o = ie.fromDate(r);
      return {
        timestampValue: hs(s.serializer, o)
      };
    }
    if (r instanceof ie) {
      const o = new ie(r.seconds, 1e3 * Math.floor(r.nanoseconds / 1e3));
      return {
        timestampValue: hs(s.serializer, o)
      };
    }
    if (r instanceof Do) return {
      geoPointValue: {
        latitude: r.latitude,
        longitude: r.longitude
      }
    };
    if (r instanceof ln) return {
      bytesValue: Wl(s.serializer, r._byteString)
    };
    if (r instanceof Re) {
      const o = s.databaseId, a = r.firestore._databaseId;
      if (!a.isEqual(o)) throw s.Wu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);
      return {
        referenceValue: mo(r.firestore._databaseId || s.databaseId, r._key.path)
      };
    }
    if (r instanceof No)
      return function(a, u) {
        return {
          mapValue: {
            fields: {
              [Il]: {
                stringValue: wl
              },
              [os]: {
                arrayValue: {
                  values: a.toArray().map((d) => {
                    if (typeof d != "number") throw u.Wu("VectorValues must only contain numeric values.");
                    return lo(u.serializer, d);
                  })
                }
              }
            }
          }
        };
      }(r, s);
    throw s.Wu(`Unsupported field value: ${bo(r)}`);
  }(n, e);
}
function Dh(n, e) {
  const t = {};
  return gl(n) ? (
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    e.path && e.path.length > 0 && e.fieldMask.push(e.path)
  ) : At(n, (r, s) => {
    const o = Fs(s, e.qu(r));
    o != null && (t[r] = o);
  }), {
    mapValue: {
      fields: t
    }
  };
}
function Nh(n) {
  return !(typeof n != "object" || n === null || n instanceof Array || n instanceof Date || n instanceof ie || n instanceof Do || n instanceof ln || n instanceof Re || n instanceof Vo || n instanceof No);
}
function Lo(n, e, t) {
  if (!Nh(t) || !function(s) {
    return typeof s == "object" && s !== null && (Object.getPrototypeOf(s) === Object.prototype || Object.getPrototypeOf(s) === null);
  }(t)) {
    const r = bo(t);
    throw r === "an object" ? e.Wu(n + " a custom object") : e.Wu(n + " " + r);
  }
}
function zi(n, e, t) {
  if (
    // If required, replace the FieldPath Compat class with the firestore-exp
    // FieldPath.
    (e = he(e)) instanceof xs
  ) return e._internalPath;
  if (typeof e == "string") return Mo(n, e);
  throw ms(
    "Field path arguments must be of type string or ",
    n,
    /* hasConverter= */
    !1,
    /* path= */
    void 0,
    t
  );
}
const _v = new RegExp("[~\\*/\\[\\]]");
function Mo(n, e, t) {
  if (e.search(_v) >= 0) throw ms(
    `Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,
    n,
    /* hasConverter= */
    !1,
    /* path= */
    void 0,
    t
  );
  try {
    return new xs(...e.split("."))._internalPath;
  } catch {
    throw ms(
      `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      n,
      /* hasConverter= */
      !1,
      /* path= */
      void 0,
      t
    );
  }
}
function ms(n, e, t, r, s) {
  const o = r && !r.isEmpty(), a = s !== void 0;
  let u = `Function ${e}() called with invalid data`;
  t && (u += " (via `toFirestore()`)"), u += ". ";
  let l = "";
  return (o || a) && (l += " (found", o && (l += ` in field ${r}`), a && (l += ` in document ${s}`), l += ")"), new O(C.INVALID_ARGUMENT, u + n + l);
}
function Oh(n, e) {
  return n.some((t) => t.isEqual(e));
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Lh {
  // Note: This class is stripped down version of the DocumentSnapshot in
  // the legacy SDK. The changes are:
  // - No support for SnapshotMetadata.
  // - No support for SnapshotOptions.
  /** @hideconstructor protected */
  constructor(e, t, r, s, o) {
    this._firestore = e, this._userDataWriter = t, this._key = r, this._document = s, this._converter = o;
  }
  /** Property of the `DocumentSnapshot` that provides the document's ID. */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * The `DocumentReference` for the document included in the `DocumentSnapshot`.
   */
  get ref() {
    return new Re(this._firestore, this._converter, this._key);
  }
  /**
   * Signals whether or not the document at the snapshot's location exists.
   *
   * @returns true if the document exists.
   */
  exists() {
    return this._document !== null;
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * @returns An `Object` containing all fields in the document or `undefined`
   * if the document doesn't exist.
   */
  data() {
    if (this._document) {
      if (this._converter) {
        const e = new yv(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(e);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(e) {
    if (this._document) {
      const t = this._document.data.field(Mh("DocumentSnapshot.get", e));
      if (t !== null) return this._userDataWriter.convertValue(t);
    }
  }
}
class yv extends Lh {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * @override
   * @returns An `Object` containing all fields in the document.
   */
  data() {
    return super.data();
  }
}
function Mh(n, e) {
  return typeof e == "string" ? Mo(n, e) : e instanceof xs ? e._internalPath : e._delegate._internalPath;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function vv(n) {
  if (n.limitType === "L" && n.explicitOrderBy.length === 0) throw new O(C.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}
class Ev {
  convertValue(e, t = "none") {
    switch (Et(e)) {
      case 0:
        return null;
      case 1:
        return e.booleanValue;
      case 2:
        return ne(e.integerValue || e.doubleValue);
      case 3:
        return this.convertTimestamp(e.timestampValue);
      case 4:
        return this.convertServerTimestamp(e, t);
      case 5:
        return e.stringValue;
      case 6:
        return this.convertBytes(vt(e.bytesValue));
      case 7:
        return this.convertReference(e.referenceValue);
      case 8:
        return this.convertGeoPoint(e.geoPointValue);
      case 9:
        return this.convertArray(e.arrayValue, t);
      case 11:
        return this.convertObject(e.mapValue, t);
      case 10:
        return this.convertVectorValue(e.mapValue);
      default:
        throw x();
    }
  }
  convertObject(e, t) {
    return this.convertObjectMap(e.fields, t);
  }
  /**
   * @internal
   */
  convertObjectMap(e, t = "none") {
    const r = {};
    return At(e, (s, o) => {
      r[s] = this.convertValue(o, t);
    }), r;
  }
  /**
   * @internal
   */
  convertVectorValue(e) {
    var t, r, s;
    const o = (s = (r = (t = e.fields) === null || t === void 0 ? void 0 : t[os].arrayValue) === null || r === void 0 ? void 0 : r.values) === null || s === void 0 ? void 0 : s.map((a) => ne(a.doubleValue));
    return new No(o);
  }
  convertGeoPoint(e) {
    return new Do(ne(e.latitude), ne(e.longitude));
  }
  convertArray(e, t) {
    return (e.values || []).map((r) => this.convertValue(r, t));
  }
  convertServerTimestamp(e, t) {
    switch (t) {
      case "previous":
        const r = Rs(e);
        return r == null ? null : this.convertValue(r, t);
      case "estimate":
        return this.convertTimestamp(Yn(e));
      default:
        return null;
    }
  }
  convertTimestamp(e) {
    const t = yt(e);
    return new ie(t.seconds, t.nanos);
  }
  convertDocumentKey(e, t) {
    const r = X.fromString(e);
    G(Yl(r));
    const s = new Zn(r.get(1), r.get(3)), o = new L(r.popFirst(5));
    return s.isEqual(t) || // TODO(b/64130202): Somehow support foreign references.
    Ye(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), o;
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Tv(n, e, t) {
  let r;
  return r = n ? n.toFirestore(e) : e, r;
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class jn {
  /** @hideconstructor */
  constructor(e, t) {
    this.hasPendingWrites = e, this.fromCache = t;
  }
  /**
   * Returns true if this `SnapshotMetadata` is equal to the provided one.
   *
   * @param other - The `SnapshotMetadata` to compare against.
   * @returns true if this `SnapshotMetadata` is equal to the provided one.
   */
  isEqual(e) {
    return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
  }
}
class xh extends Lh {
  /** @hideconstructor protected */
  constructor(e, t, r, s, o, a) {
    super(e, t, r, s, a), this._firestore = e, this._firestoreImpl = e, this.metadata = o;
  }
  /**
   * Returns whether or not the data exists. True if the document exists.
   */
  exists() {
    return super.exists();
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document or `undefined` if
   * the document doesn't exist.
   */
  data(e = {}) {
    if (this._document) {
      if (this._converter) {
        const t = new Qr(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          this.metadata,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(t, e);
      }
      return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
    }
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * By default, a `serverTimestamp()` that has not yet been set to
   * its final value will be returned as `null`. You can override this by
   * passing an options object.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @param options - An options object to configure how the field is retrieved
   * from the snapshot (for example the desired behavior for server timestamps
   * that have not yet been set to their final value).
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(e, t = {}) {
    if (this._document) {
      const r = this._document.data.field(Mh("DocumentSnapshot.get", e));
      if (r !== null) return this._userDataWriter.convertValue(r, t.serverTimestamps);
    }
  }
}
class Qr extends xh {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @override
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document.
   */
  data(e = {}) {
    return super.data(e);
  }
}
class Iv {
  /** @hideconstructor */
  constructor(e, t, r, s) {
    this._firestore = e, this._userDataWriter = t, this._snapshot = s, this.metadata = new jn(s.hasPendingWrites, s.fromCache), this.query = r;
  }
  /** An array of all the documents in the `QuerySnapshot`. */
  get docs() {
    const e = [];
    return this.forEach((t) => e.push(t)), e;
  }
  /** The number of documents in the `QuerySnapshot`. */
  get size() {
    return this._snapshot.docs.size;
  }
  /** True if there are no documents in the `QuerySnapshot`. */
  get empty() {
    return this.size === 0;
  }
  /**
   * Enumerates all of the documents in the `QuerySnapshot`.
   *
   * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
   * each document in the snapshot.
   * @param thisArg - The `this` binding for the callback.
   */
  forEach(e, t) {
    this._snapshot.docs.forEach((r) => {
      e.call(t, new Qr(this._firestore, this._userDataWriter, r.key, r, new jn(this._snapshot.mutatedKeys.has(r.key), this._snapshot.fromCache), this.query.converter));
    });
  }
  /**
   * Returns an array of the documents changes since the last snapshot. If this
   * is the first snapshot, all documents will be in the list as 'added'
   * changes.
   *
   * @param options - `SnapshotListenOptions` that control whether metadata-only
   * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
   * snapshot events.
   */
  docChanges(e = {}) {
    const t = !!e.includeMetadataChanges;
    if (t && this._snapshot.excludesMetadataChanges) throw new O(C.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t || (this._cachedChanges = /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
    function(s, o) {
      if (s._snapshot.oldDocs.isEmpty()) {
        let a = 0;
        return s._snapshot.docChanges.map((u) => {
          const l = new Qr(s._firestore, s._userDataWriter, u.doc.key, u.doc, new jn(s._snapshot.mutatedKeys.has(u.doc.key), s._snapshot.fromCache), s.query.converter);
          return u.doc, {
            type: "added",
            doc: l,
            oldIndex: -1,
            newIndex: a++
          };
        });
      }
      {
        let a = s._snapshot.oldDocs;
        return s._snapshot.docChanges.filter((u) => o || u.type !== 3).map((u) => {
          const l = new Qr(s._firestore, s._userDataWriter, u.doc.key, u.doc, new jn(s._snapshot.mutatedKeys.has(u.doc.key), s._snapshot.fromCache), s.query.converter);
          let d = -1, p = -1;
          return u.type !== 0 && (d = a.indexOf(u.doc.key), a = a.delete(u.doc.key)), u.type !== 1 && (a = a.add(u.doc), p = a.indexOf(u.doc.key)), {
            type: wv(u.type),
            doc: l,
            oldIndex: d,
            newIndex: p
          };
        });
      }
    }(this, t), this._cachedChangesIncludeMetadataChanges = t), this._cachedChanges;
  }
}
function wv(n) {
  switch (n) {
    case 0:
      return "added";
    case 2:
    case 3:
      return "modified";
    case 1:
      return "removed";
    default:
      return x();
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function pu(n) {
  n = qe(n, Re);
  const e = qe(n.firestore, yn);
  return ov(ko(e), n._key).then((t) => Av(e, n, t));
}
class Uh extends Ev {
  constructor(e) {
    super(), this.firestore = e;
  }
  convertBytes(e) {
    return new ln(e);
  }
  convertReference(e) {
    const t = this.convertDocumentKey(e, this.firestore._databaseId);
    return new Re(
      this.firestore,
      /* converter= */
      null,
      t
    );
  }
}
function xo(n) {
  n = qe(n, Ms);
  const e = qe(n.firestore, yn), t = ko(e), r = new Uh(e);
  return vv(n._query), av(t, n._query).then((s) => new Iv(e, r, n, s));
}
function Uo(n, e, t) {
  n = qe(n, Re);
  const r = qe(n.firestore, yn), s = Tv(n.converter, e);
  return jo(r, [pv(Vh(r), "setDoc", n._key, s, n.converter !== null, t).toMutation(n._key, De.none())]);
}
function Fo(n, e, t, ...r) {
  n = qe(n, Re);
  const s = qe(n.firestore, yn), o = Vh(s);
  let a;
  return a = typeof // For Compat types, we have to "extract" the underlying types before
  // performing validation.
  (e = he(e)) == "string" || e instanceof xs ? gv(o, "updateDoc", n._key, e, t, r) : mv(o, "updateDoc", n._key, e), jo(s, [a.toMutation(n._key, De.exists(!0))]);
}
function Bo(n) {
  return jo(qe(n.firestore, yn), [new ho(n._key, De.none())]);
}
function jo(n, e) {
  return function(r, s) {
    const o = new Qe();
    return r.asyncQueue.enqueueAndForget(async () => Gy(await iv(r), s, o)), o.promise;
  }(ko(n), e);
}
function Av(n, e, t) {
  const r = t.docs.get(e._key), s = new Uh(n);
  return new xh(n, s, e._key, r, new jn(t.hasPendingWrites, t.fromCache), e.converter);
}
(function(e, t = !0) {
  (function(s) {
    pn = s;
  })(dn), en(new Ot("firestore", (r, { instanceIdentifier: s, options: o }) => {
    const a = r.getProvider("app").getImmediate(), u = new yn(new _g(r.getProvider("auth-internal")), new Eg(a, r.getProvider("app-check-internal")), function(d, p) {
      if (!Object.prototype.hasOwnProperty.apply(d.options, ["projectId"])) throw new O(C.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
      return new Zn(d.options.projectId, p);
    }(a, s), a);
    return o = Object.assign({
      useFetchStreams: t
    }, o), u._setSettings(o), u;
  }, "PUBLIC").setMultipleInstances(!0)), ft(vc, Ec, e), // BUILD_TARGET will be replaced by values like esm2017, cjs2017, etc during the compilation
  ft(vc, Ec, "esm2017");
})();
var Rv = "firebase", Sv = "11.6.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
ft(Rv, Sv, "app");
let Ur, gs, Vt;
function Mv(n, e) {
  Wf().length ? (Ur = Gi(), console.log("⚠️ Firebase already initialized")) : (Ur = wu(n), console.log("✅ Firebase initialized with project:", n.projectId)), gs = uv(Ur), Vt = fg(Ur), e != null && e.useEmulator && location.hostname === "localhost" && (Ch(gs, "localhost", 8081), Hu(Vt, "http://localhost:9099"), console.log("🔥 Connected to Firestore emulator at localhost:8081"), console.log("🔥 Connected to Auth emulator at http://localhost:9099"));
}
const Pv = hn("AuthStore", () => {
  const n = "AuthStore", e = Ge(null), t = Ge(null), r = Ge(null);
  async function s(y, w) {
    console.log("authStore.sendMagicLink", y, w);
    const k = await fetch("http://localhost:5001/clickhelp-68faa/us-central1/sendLoginLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: {
          email: y,
          app: w
        }
      })
    }), N = await k.json();
    if (console.log("✅ Magic link function result:", N), !k.ok)
      throw new Error(N.error || "Failed to send magic link");
    window.localStorage.setItem("emailForSignIn", y);
  }
  async function o(y, w) {
    const P = window.localStorage.getItem("emailForSignIn");
    if (!(!P || !Yp(Vt, y)))
      try {
        const k = await Zp(Vt, P, y);
        e.value = k.user, window.localStorage.removeItem("emailForSignIn");
        const N = Ne(gs, "users", e.value.uid), V = await pu(N);
        if (!V.exists()) {
          await cc(Vt), e.value = null, t.value = null, r.value = "Your account is not registered. Please contact support.", w && w.push("/login");
          return;
        }
        t.value = V.data(), w && w.push("/dashboard");
      } catch (k) {
        r.value = k.message, console.error("Sign-in error:", k);
      }
  }
  async function a(y) {
    console.log("User clicked SignOut");
    try {
      await cc(Vt), e.value = null, t.value = null, y && y.push("/home");
    } catch (w) {
      r.value = w.message, console.error("Sign-out error:", w);
    }
  }
  function u(y) {
    nm(Vt, async (w) => {
      if (e.value = w, w) {
        const P = await pu(Ne(gs, "users", w.uid));
        t.value = P.exists() ? P.data() : null, y && y.push("/dashboard");
      } else
        t.value = null, y && y.push("/login");
    });
  }
  const l = Fr(() => t.value), d = Fr(() => {
    var y;
    return ((y = t.value) == null ? void 0 : y.role) || null;
  }), p = Fr(() => r.value);
  return {
    // State
    storName: n,
    user: e,
    userProfile: t,
    error: r,
    // Actions
    sendMagicLink: s,
    validateMagicLink: o,
    signOut: a,
    onAuthStateChanged: u,
    // Getters
    getUserProfile: l,
    getUserRole: d,
    getError: p
  };
}), Cv = hn("MainStore", () => {
  const n = Ge("MainStore"), e = Ge("home"), t = Ge(1), r = Fr(() => e.value.toUpperCase());
  function s() {
    return console.log("🧪 MainStore test function"), e.value = "test-mode", "Action executed!";
  }
  return {
    storName: n,
    tabMenu: e,
    uppercaseTab: r,
    selectedTab: t,
    funcTest: s
  };
}), bv = hn("example", () => {
  const n = Ge([]);
  let e = null;
  const t = (u) => {
    e = u;
  }, r = async () => {
    if (!e) throw new Error("Firestore not initialized");
    const u = await xo(un(e, "example"));
    n.value = u.docs.map((l) => ({
      id: l.id,
      ...l.data()
    }));
  };
  return {
    records: n,
    init: t,
    readRecords: r,
    createRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      const l = Ne(un(e, "example"));
      await Uo(l, u), await r();
    },
    updateRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      const l = Ne(e, "example", u.id), { id: d, ...p } = u;
      await Fo(l, p), await r();
    },
    deleteRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      await Bo(Ne(e, "example", u)), await r();
    }
  };
}), kv = hn("faqs", () => {
  const n = Ge([]);
  let e = null;
  const t = (u) => {
    e = u;
  }, r = async () => {
    if (!e) throw new Error("Firestore not initialized");
    const u = await xo(un(e, "faqs"));
    n.value = u.docs.map((l) => ({
      id: l.id,
      ...l.data()
    }));
  };
  return {
    records: n,
    init: t,
    readRecords: r,
    createRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      const l = Ne(un(e, "faqs"));
      await Uo(l, u), await r();
    },
    updateRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      const l = Ne(e, "faqs", u.id), { id: d, ...p } = u;
      await Fo(l, p), await r();
    },
    deleteRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      await Bo(Ne(e, "faqs", u)), await r();
    }
  };
}), Vv = hn("users", () => {
  const n = Ge([]);
  let e = null;
  const t = (u) => {
    e = u;
  }, r = async () => {
    if (!e) throw new Error("Firestore not initialized");
    const u = await xo(un(e, "users"));
    n.value = u.docs.map((l) => ({
      id: l.id,
      ...l.data()
    }));
  };
  return {
    records: n,
    init: t,
    readRecords: r,
    createRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      const l = Ne(un(e, "users"));
      await Uo(l, u), await r();
    },
    updateRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      const l = Ne(e, "users", u.id), { id: d, ...p } = u;
      await Fo(l, p), await r();
    },
    deleteRecord: async (u) => {
      if (!e) throw new Error("Firestore not initialized");
      await Bo(Ne(e, "users", u)), await r();
    }
  };
}), Dv = hn("OptionStore", {
  state: () => ({
    storName: "OptionStore",
    tabMenu: "home"
  }),
  actions: {
    funcTest() {
      this.tabMenu = "clicked";
    }
  }
});
function xv(n) {
  const e = Cv(), t = bv(), r = Pv(), s = Dv(), o = kv(), a = Vv();
  n.provide("storMain", e), n.provide("storExample", t), n.provide("storAuth", r), n.provide("storOption", s), n.provide("storFAQ", o), n.provide("storUsers", a);
}
export {
  Ur as app,
  Vt as auth,
  gs as db,
  Mv as initFirebase,
  xv as registerStores,
  Pv as useAuthStore
};
