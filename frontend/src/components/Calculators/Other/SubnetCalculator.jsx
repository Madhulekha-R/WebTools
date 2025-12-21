import React, { useState } from "react";
import "./SubnetCalculator.css";

// Helper for mask to prefix length (e.g., 255.255.255.0 => 24)
function maskToPrefix(mask) {
  return mask
    .split('.')
    .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
    .join('')
    .split('1').length - 1;
}

// Helper for prefix length to mask (e.g., 24 => 255.255.255.0)
function prefixToMask(prefix) {
  const bin = '1'.repeat(prefix).padEnd(32, '0');
  return [0, 8, 16, 24].map(x => parseInt(bin.slice(x, x+8), 2)).join('.');
}

// Table of subnets (sample data, expand as needed)
const IPv4Subnets = [
  { prefix: 8, mask: "255.0.0.0", hosts: "16,777,214", cls: "A" },
  { prefix: 16, mask: "255.255.0.0", hosts: "65,534", cls: "B" },
  { prefix: 24, mask: "255.255.255.0", hosts: "254", cls: "C" },
  // Add more entries or generate programmatically if needed
];

export default function SubnetCalculator() {
  // IPv4 states
  const [ipClass, setIPClass] = useState("any");
  const [subnet, setSubnet] = useState("255.255.255.252 /30");
  const [ipAddress, setIPAddress] = useState("");
  // IPv6 states
  const [ipv6Prefix, setIpv6Prefix] = useState("64");
  const [ipv6Address, setIpv6Address] = useState("");
  // Results
  const [result, setResult] = useState(null);
  const [result6, setResult6] = useState(null);

  // Handle IPv4 calculation
  function handleCalculate(e) {
    e.preventDefault();
    // Parse mask and prefix
    let [mask, prefix] = subnet.split(" /");
    prefix = parseInt(prefix);
    const hosts = prefix >= 32 ? 0 : Math.pow(2, 32 - prefix) - 2;
    setResult({
      mask,
      prefix,
      hosts,
      ip: ipAddress,
      cls: ipClass,
    });
  }
  // Handle IPv6 calculation
  function handleCalculate6(e) {
    e.preventDefault();
    // Show prefix info
    setResult6({
      prefix: ipv6Prefix,
      ip: ipv6Address,
      hosts: BigInt(2) ** BigInt(128 - parseInt(ipv6Prefix)),
    });
  }

  return (
    <div className="subnet-calc-root">
      <h2 className="subnet-calc-heading">IP Subnet Calculator</h2>
      <div className="subnet-calc-desc">
        This calculator returns a variety of information regarding Internet Protocol version 4 (IPv4) and IPv6 subnets including possible network addresses, usable host ranges, subnet mask, and IP class, among others    
      </div>

      {/* IPv4 Calculator */}
      <h3 className="subnet-calc-section">IPv4 Subnet Calculator :</h3>
      <div className="subnet-calc-card">
        <form onSubmit={handleCalculate} className="subnet-calc-form">
          <div className="subnet-radio-row">
            <span>Network Class</span>
            <label><input type="radio" name="class" checked={ipClass==="any"} onChange={()=>setIPClass("any")}/>Any</label>
            <label><input type="radio" name="class" checked={ipClass==="A"} onChange={()=>setIPClass("A")}/>A</label>
            <label><input type="radio" name="class" checked={ipClass==="B"} onChange={()=>setIPClass("B")}/>B</label>
            <label><input type="radio" name="class" checked={ipClass==="C"} onChange={()=>setIPClass("C")}/>C</label>
          </div>
          <div className="subnet-form-row">
            <label>Subnet</label>
            <select value={subnet} onChange={e=>setSubnet(e.target.value)} required>
              {Array.from({length: 25}).map((_,i) => {
                const prefix = 32-i;
                const mask = prefixToMask(prefix);
                return <option key={prefix} value={mask + " /" + prefix}>
                  {mask} /{prefix}
                </option>
              })}
            </select>
          </div>
          <div className="subnet-form-row">
            <label>IP Address</label>
            <input type="text" placeholder="e.g. 223.178.82.81" value={ipAddress} onChange={e => setIPAddress(e.target.value)} />
          </div>
          <div className="subnet-btn-row">
            <button type="submit" className="subnet-calc-btn">Calculate</button>
            <button type="button" className="subnet-clear-btn" onClick={()=>setResult(null)}>Clear</button>
          </div>
        </form>
        {result && (
          <div className="subnet-result">
            <strong>Subnet Mask:</strong> {result.mask} <br/>
            <strong>Prefix:</strong> /{result.prefix}<br/>
            <strong>Usable hosts per subnet:</strong> {result.hosts}<br/>
            <strong>IP Address:</strong> {result.ip}<br/>
            <strong>Class:</strong> {result.cls}
          </div>
        )}
      </div>

      {/* IPv6 Calculator */}
      <h3 className="subnet-calc-section">IPv6 Subnet Calculator :</h3>
      <div className="subnet-calc-card">
        <form onSubmit={handleCalculate6} className="subnet-calc-form">
          <div className="subnet-form-row">
            <label>Prefix Length</label>
            <select value={ipv6Prefix} onChange={e=>setIpv6Prefix(e.target.value)}>
              {Array.from({length: 129}, (_,i)=>i).filter(i=>i>=1 && i<=128).map(i =>
                <option key={i} value={i}>/{i}</option>
              )}
            </select>
          </div>
          <div className="subnet-form-row">
            <label>IP Address</label>
            <input type="text" placeholder="e.g. 2001:db8::1" value={ipv6Address} onChange={e => setIpv6Address(e.target.value)} />
          </div>
          <div className="subnet-btn-row">
            <button type="submit" className="subnet-calc-btn">Calculate</button>
            <button type="button" className="subnet-clear-btn" onClick={()=>setResult6(null)}>Clear</button>
          </div>
        </form>
        {result6 && (
          <div className="subnet-result">
            <strong>Prefix Length:</strong> /{result6.prefix}<br/>
            <strong>IP Address:</strong> {result6.ip}<br/>
            <strong>Usable hosts per subnet:</strong> {result6.hosts.toLocaleString()}
          </div>
        )}
      </div>

      {/* Educational info */}
      <div className="subnet-calc-content">
        <p>
        A subnet is a division of an IP network (internet protocol suite), where an IP network is a set of communications protocols used on the Internet and other similar networks. It is commonly known as TCP/IP (Transmission Control Protocol/Internet Protocol).
        </p>
        <p>
        The act of dividing a network into at least two separate networks is called subnetting, and routers are devices that allow traffic exchange between subnetworks, serving as a physical boundary. IPv4 is the most common network addressing architecture used, though the use of IPv6 has been growing since 2006.
        </p>
        <p>
        An IP address is comprised of a network number (routing prefix) and a rest field (host identifier). A rest field is an identifier that is specific to a given host or network interface. A routing prefix is often expressed using Classless Inter-Domain Routing (CIDR) notation for both IPv4 and IPv6. CIDR is a method used to create unique identifiers for networks, as well as individual devices. For IPv4, networks can also be characterized using a subnet mask, which is sometimes expressed in dot-decimal notation, as shown in the "Subnet" field in the calculator. All hosts on a subnetwork have the same network prefix, unlike the host identifier, which is a unique local identification.
        </p>
      </div>

      {/* Subnet Table */}
    <div className="subnet-table-section">
    <h4 className="subnet-table-title">Below is a table providing typical subnets for IPv4 :</h4>
    <table className="subnet-table">
        <thead>
        <tr>
            <th>Prefix size</th>
            <th>Network mask</th>
            <th>Usable hosts per subnet</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>/1</td><td>128.0.0.0</td><td>2,147,483,646</td></tr>
        <tr><td>/2</td><td>192.0.0.0</td><td>1,073,741,822</td></tr>
        <tr><td>/3</td><td>224.0.0.0</td><td>536,870,910</td></tr>
        <tr><td>/4</td><td>240.0.0.0</td><td>268,435,454</td></tr>
        <tr><td>/5</td><td>248.0.0.0</td><td>134,217,726</td></tr>
        <tr><td>/6</td><td>252.0.0.0</td><td>67,108,862</td></tr>
        <tr><td>/7</td><td>254.0.0.0</td><td>33,554,430</td></tr>
        
        <tr className="class-divider"><td colSpan="3"><strong>Class A</strong></td></tr>
        
        <tr><td>/8</td><td>255.0.0.0</td><td>16,777,214</td></tr>
        <tr><td>/9</td><td>255.128.0.0</td><td>8,388,606</td></tr>
        <tr><td>/10</td><td>255.192.0.0</td><td>4,194,302</td></tr>
        <tr><td>/11</td><td>255.224.0.0</td><td>2,097,150</td></tr>
        <tr><td>/12</td><td>255.240.0.0</td><td>1,048,574</td></tr>
        <tr><td>/13</td><td>255.248.0.0</td><td>524,286</td></tr>
        <tr><td>/14</td><td>255.252.0.0</td><td>262,142</td></tr>
        <tr><td>/15</td><td>255.254.0.0</td><td>131,070</td></tr>
        
        <tr className="class-divider"><td colSpan="3"><strong>Class B</strong></td></tr>
        
        <tr><td>/16</td><td>255.255.0.0</td><td>65,534</td></tr>
        <tr><td>/17</td><td>255.255.128.0</td><td>32,766</td></tr>
        <tr><td>/18</td><td>255.255.192.0</td><td>16,382</td></tr>
        <tr><td>/19</td><td>255.255.224.0</td><td>8,190</td></tr>
        <tr><td>/20</td><td>255.255.240.0</td><td>4,094</td></tr>
        <tr><td>/21</td><td>255.255.248.0</td><td>2,046</td></tr>
        <tr><td>/22</td><td>255.255.252.0</td><td>1,022</td></tr>
        <tr><td>/23</td><td>255.255.254.0</td><td>510</td></tr>
        
        <tr className="class-divider"><td colSpan="3"><strong>Class C</strong></td></tr>
        
        <tr><td>/24</td><td>255.255.255.0</td><td>254</td></tr>
        <tr><td>/25</td><td>255.255.255.128</td><td>126</td></tr>
        <tr><td>/26</td><td>255.255.255.192</td><td>62</td></tr>
        <tr><td>/27</td><td>255.255.255.224</td><td>30</td></tr>
        <tr><td>/28</td><td>255.255.255.240</td><td>14</td></tr>
        <tr><td>/29</td><td>255.255.255.248</td><td>6</td></tr>
        <tr><td>/30</td><td>255.255.255.252</td><td>2</td></tr>
        <tr><td>/31</td><td>255.255.255.254</td><td>0</td></tr>
        <tr><td>/32</td><td>255.255.255.255</td><td>0</td></tr>
        </tbody>
    </table>
    </div>

    </div>
  );
}
