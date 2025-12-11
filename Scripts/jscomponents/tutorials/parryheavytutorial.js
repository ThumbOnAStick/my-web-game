import { Tutorial } from "../tutorial.js";
import * as EventHandler from "../../jsutils/events/eventhandlers.js";
import { SwingType } from "../../jscomponents/charactercombatstate.js";

export class ParryHeavyTutorial extends Tutorial {
    constructor() {
        super();
        this.handleParry = this.handleParry.bind(this);
        this.subtitle = "Tutorial_ParryHeavy";
    }

    bindEvents() {
        this.eventManager.on(EventHandler.spawnParryFlashEvent, this.handleParry);
    }

    handleParry(data) {
        if (this.isCompleted) return;
        // data is the character who parried (spawned the flash)
        if (data && !data.isOpponent) {
            // Check if the opponent was using a heavy attack
            // We need to access the opponent's state. 
            // Since we don't have direct access to opponent here, we might need to rely on 
            // the fact that this tutorial is only active when the opponent is programmed to do heavy attacks.
            // However, to be precise, we should check if the parry was against a heavy attack.
            
            // In CombatHandler.characterParry, the offenderSource is passed but not emitted in spawnParryFlashEvent.
            // The spawnParryFlashEvent only emits the defender.
            
            // But wait, the user asked to check if player parried HEAVY attack.
            // In the current game logic, parrying is done by performing a heavy attack against an incoming attack.
            // If the incoming attack is LIGHT, it can be parried.
            // If the incoming attack is HEAVY, it CANNOT be parried (based on CombatHandler.damageResult logic: cannotBeParried returns true if types match).
            // Wait, let's check `cannotBeParried`.
            
            /*
            cannotBeParried(other)
            {
                return other == this.swingType && this.swinging;
            }
            */
           
            // If defender is parrying (which means they are charging a heavy attack, see `canParry`),
            // `canParry` returns true if `!dodging && isCharging`.
            // `isCharging` is set true when starting an attack.
            // `performHeavyAttack` sets swingType to HEAVY.
            
            // So if defender is doing HEAVY attack (parrying), `defender.combatState.swingType` is HEAVY.
            
            // `damageResult` checks:
            // if(defender.combatState.canParry()) // True if charging heavy
            // {
            //     if(combatStateOther && combatStateOther.cannotBeParried(defender.combatState.swingType))
            //     {
            //         return 'hit';
            //     }
            //     return 'parry';
            // }
            
            // `combatStateOther.cannotBeParried(defenderSwingType)`:
            // `other` is defender's swing type (HEAVY).
            // `this` is offender's combat state.
            // returns `other == this.swingType && this.swinging`.
            
            // So if Offender is doing HEAVY attack, `this.swingType` is HEAVY.
            // `other` (Defender's parry) is HEAVY.
            // HEAVY == HEAVY -> True.
            // So `cannotBeParried` returns True.
            // `damageResult` returns 'hit'.
            
            // This means you CANNOT parry a HEAVY attack with a HEAVY attack (which is the parry mechanic).
            // You can only parry LIGHT attacks?
            
            // Let's check `cannotBeParried` again.
            // `return other == this.swingType && this.swinging;`
            
            // If Offender is LIGHT. `this.swingType` is LIGHT.
            // Defender is HEAVY (Parry). `other` is HEAVY.
            // LIGHT == HEAVY -> False.
            // `cannotBeParried` returns False.
            // `damageResult` returns 'parry'.
            
            // So currently, you can ONLY parry LIGHT attacks.
            // You CANNOT parry HEAVY attacks.
            
            // The user request: "Add a new tutorial that check if player parried heavy attack".
            // This implies the user WANTS the player to be able to parry heavy attacks, OR they misunderstand the mechanics, OR I am misunderstanding.
            
            // If the user wants a tutorial for parrying heavy attacks, maybe they mean "Parry using Heavy Attack"?
            // The existing `ParryTutorial` says "Press heavy attack to parry when enemy attacks."
            
            // If the user implies that there is a mechanic to parry heavy attacks, maybe I should check if I missed something.
            // But based on `damageResult`, it seems impossible to parry a heavy attack if the parry itself is a heavy attack.
            
            // UNLESS, the "Parry" mechanic is different.
            // `canParry` checks `isCharging`.
            // `performHeavyAttack` sets `isCharging = true`.
            
            // Maybe the user wants to change the mechanic?
            // "Enable veteran decision tree in ai controller when difficulty === 2... the decision tree also have better reflex."
            // That was previous request.
            
            // Current request: "Add a new tutorial that check if player parried heavy attack to tutorialhelper, add revelant translations"
            
            // If I assume the user wants to teach the player to parry a heavy attack, I must assume it IS possible or the user wants me to make it possible?
            // Or maybe the user means "Parry *using* Heavy Attack"? But that's the standard parry.
            
            // Let's look at `cannotBeParried` again.
            // `return other == this.swingType && this.swinging;`
            // If I attack with HEAVY, and you defend with HEAVY.
            // Offender: HEAVY. Defender: HEAVY.
            // Offender.cannotBeParried(HEAVY) -> HEAVY == HEAVY -> True.
            // Result: HIT.
            
            // If I attack with LIGHT, and you defend with HEAVY.
            // Offender: LIGHT. Defender: HEAVY.
            // Offender.cannotBeParried(HEAVY) -> LIGHT == HEAVY -> False.
            // Result: PARRY.
            
            // So currently:
            // HEAVY vs HEAVY = HIT (Both get hit? or Defender gets hit?)
            // `damageResult` is called on Defender. So Defender gets HIT.
            
            // So you cannot parry a heavy attack.
            
            // Maybe the user means "Parry *a* Heavy Attack" and expects me to change the code so it's possible?
            // Or maybe the user made a typo and meant "Parry *with* Heavy Attack" (which is the existing tutorial)?
            // But `ParryTutorial` already exists.
            
            // Let's assume the user wants a tutorial where the ENEMY performs a HEAVY attack and the player successfully PARRIES it.
            // This would require changing the game logic to allow parrying heavy attacks, OR the user is mistaken.
            
            // However, if I look at `parrytutorial.js`, it just checks for `spawnParryFlashEvent`.
            // This event is emitted in `characterParry`.
            // `characterParry` is called when `damageResult` returns 'parry'.
            
            // If I create a tutorial that forces the AI to do Heavy Attacks, and the player tries to parry... they will get hit.
            // So the tutorial would be impossible to complete.
            
            // Maybe the user wants a tutorial where the player *blocks* or *dodges* a heavy attack?
            // "check if player parried heavy attack"
            
            // Let's look at the `cannotBeParried` logic in `CharacterCombatState`.
            /*
            cannotBeParried(other)
            {
                return other == this.swingType && this.swinging;
            }
            */
            // This logic specifically makes same-type attacks unparriable.
            // Heavy vs Heavy = Unparriable.
            // Light vs Heavy = Parriable.
            
            // Maybe the user wants to teach that you CANNOT parry heavy attacks?
            // But the request says "check if player parried".
            
            // Let's assume the user wants to change the mechanic so that Heavy Attacks CAN be parried, OR that there is a special condition.
            // OR, maybe I should just implement the tutorial and if it's impossible, well...
            
            // Wait, maybe the user means "Parry *a* Light Attack" (which is what ParryTutorial does) and wants another one?
            // No, "ParryHeavyTutorial".
            
            // Let's look at `Scripts/jsutils/combathandler.js` again.
            // `damageResult` calls `combatStateOther.cannotBeParried`.
            
            // If I modify `cannotBeParried` to return false for Heavy vs Heavy, then it becomes parriable.
            // But that changes the game balance.
            
            // Let's assume the user knows what they are asking and maybe I should check if `spawnParryFlashEvent` contains info about the attack type.
            // It passes `defender`.
            
            // I can modify `characterParry` to pass `offender` in the event data?
            // `gameEventManager.emit(EventHandlers.spawnParryFlashEvent, defender);`
            
            // If I change it to:
            // `gameEventManager.emit(EventHandlers.spawnParryFlashEvent, { defender, offender });`
            // Then I can check `offender.combatState.swingType`.
            
            // But first, IS IT POSSIBLE to parry a heavy attack?
            // If not, the tutorial is useless.
            
            // Maybe the user wants me to make it possible?
            // "Add a new tutorial that check if player parried heavy attack"
            
            // Let's assume the user implies that I should make it possible OR that I should just add the tutorial and maybe they will change the mechanics later?
            // But usually "Add a tutorial" implies it should work.
            
            // Let's check if there is any other way to parry.
            // `canParry` -> `!this.dodging && this.isCharging`.
            
            // If I look at `parrytutorial.js`, it sets the AI to `buildLightSwingTree`.
            // `this.aiController.rootNode = DecisionTreeHelperTutor.buildLightSwingTree();`
            // This forces the AI to do Light Attacks.
            // And the player parries them.
            
            // If I make `ParryHeavyTutorial`, I should probably set AI to `buildHeavySwingTree`.
            // And then the player tries to parry.
            // If they succeed, the tutorial completes.
            
            // If they currently CANNOT parry heavy attacks, then I should probably fix that or ask?
            // But I cannot ask.
            
            // Let's look at `cannotBeParried` again.
            // `return other == this.swingType && this.swinging;`
            // If I change this to `return false`, then everything is parriable.
            // If I change it to `return other != this.swingType`, then only SAME type is parriable? No.
            
            // Maybe the user thinks Heavy attacks ARE parriable?
            // Or maybe I am misinterpreting `other`.
            // `damageResult(defender, combatStateOther)`
            // `combatStateOther.cannotBeParried(defender.combatState.swingType)`
            // `defender.combatState.swingType` is the Parry Type (Heavy).
            
            // If Offender is Heavy. `this.swingType` = Heavy.
            // `other` = Heavy.
            // `Heavy == Heavy` -> True.
            // `cannotBeParried` -> True.
            
            // So Heavy attacks cannot be parried by Heavy parry.
            
            // Is there a Light Parry?
            // `performLightAttack` -> `setSwingType(SwingType.LIGHT)`.
            // `canParry` -> `isCharging`.
            // `performLightAttack` sets `isCharging = true`.
            // So you CAN parry with Light Attack?
            
            // If I parry with Light Attack (Light Swing).
            // Offender: Heavy.
            // Defender: Light.
            // Offender.cannotBeParried(Light).
            // Heavy == Light -> False.
            // Result: PARRY.
            
            // So... You CAN parry a Heavy Attack by using a LIGHT Attack?
            // Let's check `performLightAttack`.
            /*
              performLightAttack() {
                if (this.combatState.canAttack()) {
                  this.setSwingType(SwingType.LIGHT);
                  this.playLightSwingAnimation();
                  this.callLightSwingEvent();
                }
              },
            */
            // `handleLightSwingEvent` sets `isCharging = true`.
            // So yes, Light Attack sets `isCharging`.
            // So `canParry` returns true.
            
            // So if I use Light Attack against Heavy Attack:
            // Offender (Heavy) vs Defender (Light).
            // Offender.cannotBeParried(Light) -> Heavy == Light -> False.
            // Result: PARRY.
            
            // So you CAN parry a Heavy Attack, but you must use a LIGHT Attack to do it.
            // And you CAN parry a Light Attack, but you must use a HEAVY Attack to do it.
            // (Light vs Heavy -> Light == Heavy -> False -> Parry).
            
            // But Light vs Light -> Light == Light -> True -> Hit.
            
            // So the mechanic is:
            // Parry Light with Heavy.
            // Parry Heavy with Light.
            
            // The existing `ParryTutorial` says: "Press heavy attack to parry when enemy attacks."
            // And it sets AI to Light Swing.
            // So it teaches Parry Light with Heavy.
            
            // The new `ParryHeavyTutorial` should teach Parry Heavy with Light.
            
            // So I need to:
            // 1. Create `ParryHeavyTutorial.js`.
            // 2. In `ParryHeavyTutorial`, listen for `spawnParryFlashEvent`.
            // 3. But `spawnParryFlashEvent` doesn't tell me WHAT was parried.
            // 4. I should modify `spawnParryFlashEvent` to include the offender or attack type, OR just assume if a parry happens during this tutorial (where AI only does Heavy attacks), it's a Heavy Parry.
            
            // I will modify `TutorialManager` to set AI to `buildHeavySwingTree` for `ParryHeavyTutorial`.
            // And in `ParryHeavyTutorial`, I will just accept any parry, because if the AI is only doing Heavy attacks, any parry MUST be a Heavy Parry (done via Light Attack).
            
            this.complete();
        }
    }
}
