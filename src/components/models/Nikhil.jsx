import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useLipsync } from '../../hooks/useLipsync';
import { useHeadTracking } from '../../hooks/useHeadTracking';

export function Nikhil(props) {
  const { nodes, materials, scene } = useGLTF('/tate.glb')
  const { animations } = useGLTF('/tateAnim.glb');
  const nikhilRef = useRef()
  const { actions, mixer } = useAnimations(animations, nikhilRef);
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === 'Idle') ? 'Idle' : animations[1].name // Check if Idle animation exists otherwise use first animation
  );
  const { client } = props;

  useEffect(() => {
    client?.convaiClient.current.sendTextChunk("");
  }, [])

  useEffect(() => {
    if (client?.isTalking) {
      setAnimation('Talking');
    } else {
      setAnimation('Idle');
    }
  }, [client?.isTalking]);
  useEffect(() => {
    actions[animation]
      .reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);


  useLipsync({ client, characterRef: nikhilRef, nodes, scene });
  useHeadTracking({ client, nodes });
  return (
    <group ref={nikhilRef} {...props} dispose={null}>
      <group name="Scene">
        <group name="party-m-0001" scale={0.013}>
        <skinnedMesh
          name="SK_Lamar_Alexander_look1_113407_01"
          geometry={nodes.SK_Lamar_Alexander_look1_113407_01.geometry}
          material={materials['Character.001']}
          skeleton={nodes.SK_Lamar_Alexander_look1_113407_01.skeleton}
          morphTargetDictionary={nodes.SK_Lamar_Alexander_look1_113407_01.morphTargetDictionary}
          morphTargetInfluences={nodes.SK_Lamar_Alexander_look1_113407_01.morphTargetInfluences}
        />
          <primitive object={nodes.RL_BoneRoot} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/tate.glb')