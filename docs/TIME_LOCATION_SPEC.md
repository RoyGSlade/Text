# Specification: Spatial Navigation, Coordinate Grids, & Temporal Cycle Mechanics

This document outlines the architectural roadmap and design details for the **Time & Location Pane (Status Header)**, detailing how these mock sectors, grid coordinates, and cycle counters will influence gameplay in future milestones.

---

## 1. Spatial Grid Coordinates & Sector Design

Active star systems (like the sector surrounding **Marrow Station**) are split into spatial matrices. In the current interface, the **3x3 Map Quadrant** represents local coordinates `[X, Y]` within a specific sector.

### Active Coordinate Map (3x3 grid)
*   **Sector Grid Boundary:** 3x3 local grid cells (indices `0` to `2`).
*   **Coordinate States:**
    *   `[0, 0]` - Alpha Sector Outskirts (Outer sensor array)
    *   `[1, 0]` - Outer Ring Habitation Zones
    *   `[1, 1]` - Core Hub & Admin Deck (Marrow Station)
    *   `[1, 2]` - Docking Spire & Sector Exchange
    *   `[2, 2]` - Deep Space Relay Tower (Exterior platforms)

### Future Integration with Navigation Checks
When transitioning between nodes, instead of immediate teleportation, the engine will process a **Movement Check** or **Piloting / Astrogation Check**:
1.  **Piloting Check:** A skill check (e.g., `Intelligence (Astrogation)` or `Dexterity (Piloting)`) against the sector's **Hazard Level**.
2.  **Success:** Smooth transition to the adjacent coordinate cell.
3.  **Failure:** Interception by sector security, stray orbital debris collision (-HP), or temporal drift.

---

## 2. Hazard Levels & Environmental Pressures

Sectors possess environmental modifiers that alter character stats:
*   **Solar Radiation (Radiation Storms):** In quadrants `[2, y]`, characters without radiation shielding (e.g., Lead-Lined Jumpsuits) lose `1 HP` every `2 Cycles`.
*   **Deep Vacuum Hazard:** High risk in outer relay platforms (`[2, 2]`). Androids are immune, but Humans must equip pressurized gear or lose vital integrity.
*   **Sensor Interference:** Heavy static in sector boundaries disables the developer drawer stats and gates standard choices until decryption skill checks succeed.

---

## 3. Temporal Cycle Clock Mechanics

The **System Cycle** acts as the temporal timeline of the sector. Currently, it increments deterministically with every RNG roll or history log update.

### Cycle Progression Rules
*   **Seeded Time Steps:** Standard story choices advance time by `0.05 Cycles`.
*   **Skill Checks / Interactions:** Seeded dice rolls or mechanical operations advance time by `0.15 Cycles` (simulating physical effort).
*   **Resting / Nanite Charging:** Complete cycles (`1.00`) can be skipped to restore vital integrity (HP) at the cost of changing global encounter tables.

### Time-Gated Directives (Quests)
Certain directives will include active expiration times:
*   *Example Quest:* **"Stabilize Reactor Shielding"**
    *   **Deadline:** Must complete before `Cycle 3850.00`.
    *   **Outcome:** If the active cycle surpasses this marker, the objective fails, shifting the scene graph permanently to `reactor_melted`.

---

## 4. Save/Load Serialization & State Persistence

To ensure these features recover safely across sessions, both parameters will be serialized in the primary state JSON:

```json
{
  "activeSector": {
    "name": "Alpha-12",
    "coordinates": [1, 2],
    "zone": "outer_ring"
  },
  "temporalClock": {
    "currentCycle": 3842.30,
    "elapsedTime": 1420
  }
}
```

This persistent structure guarantees that spatial location and active cycle times are preserved inside local storage save blocks.
