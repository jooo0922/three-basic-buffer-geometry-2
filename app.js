'use strict';

import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

function main() {
  // create WebGLRenderer
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas
  });

  // create camera
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  // create scene
  const scene = new THREE.Scene;

  // create directional light
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // 이전에는 built-in geometry로 정육면체 박스 지오메트리를 생성했지만, 이제 사용자 지정 BufferGeometry로 생성해볼거임.
  // 우선, 만들고자 하는 geometry의 각 vertex(꼭지점)의 BufferAttribute들(position, normal, color, uv)을 직접 지정해서 배열로 정리해놓아야 함.
  const vertices = [
    // 앞쪽
    {
      pos: [-1, -1, 1],
      norm: [0, 0, 1],
      uv: [0, 0],
    }, // 0
    {
      pos: [1, -1, 1],
      norm: [0, 0, 1],
      uv: [1, 0],
    }, // 1
    {
      pos: [-1, 1, 1],
      norm: [0, 0, 1],
      uv: [0, 1],
    }, // 2
    // { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], },
    // { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], },
    {
      pos: [1, 1, 1],
      norm: [0, 0, 1],
      uv: [1, 1],
    }, // 3

    // 오른쪽
    {
      pos: [1, -1, 1],
      norm: [1, 0, 0],
      uv: [0, 0],
    }, // 4
    {
      pos: [1, -1, -1],
      norm: [1, 0, 0],
      uv: [1, 0],
    }, // 5
    // { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
    // { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
    {
      pos: [1, 1, 1],
      norm: [1, 0, 0],
      uv: [0, 1],
    }, // 6
    {
      pos: [1, 1, -1],
      norm: [1, 0, 0],
      uv: [1, 1],
    }, // 7

    // 뒤쪽
    {
      pos: [1, -1, -1],
      norm: [0, 0, -1],
      uv: [0, 0],
    }, // 8
    {
      pos: [-1, -1, -1],
      norm: [0, 0, -1],
      uv: [1, 0],
    }, // 9
    // { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
    // { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
    {
      pos: [1, 1, -1],
      norm: [0, 0, -1],
      uv: [0, 1],
    }, // 10
    {
      pos: [-1, 1, -1],
      norm: [0, 0, -1],
      uv: [1, 1],
    }, // 11

    // 왼쪽
    {
      pos: [-1, -1, -1],
      norm: [-1, 0, 0],
      uv: [0, 0],
    }, // 12
    {
      pos: [-1, -1, 1],
      norm: [-1, 0, 0],
      uv: [1, 0],
    }, // 13
    // { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], },
    // { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], },
    {
      pos: [-1, 1, -1],
      norm: [-1, 0, 0],
      uv: [0, 1],
    }, // 14
    {
      pos: [-1, 1, 1],
      norm: [-1, 0, 0],
      uv: [1, 1],
    }, // 15

    // 상단
    {
      pos: [1, 1, -1],
      norm: [0, 1, 0],
      uv: [0, 0],
    }, // 16
    {
      pos: [-1, 1, -1],
      norm: [0, 1, 0],
      uv: [1, 0],
    }, // 17
    // { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], },
    // { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], },
    {
      pos: [1, 1, 1],
      norm: [0, 1, 0],
      uv: [0, 1],
    }, // 18
    {
      pos: [-1, 1, 1],
      norm: [0, 1, 0],
      uv: [1, 1],
    }, // 19

    // 하단
    {
      pos: [1, -1, 1],
      norm: [0, -1, 0],
      uv: [0, 0],
    }, // 20
    {
      pos: [-1, -1, 1],
      norm: [0, -1, 0],
      uv: [1, 0],
    }, // 21
    // { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], },
    // { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], },
    {
      pos: [1, -1, -1],
      norm: [0, -1, 0],
      uv: [0, 1],
    }, // 22
    {
      pos: [-1, -1, -1],
      norm: [0, -1, 0],
      uv: [1, 1],
    }, // 23
  ];
  // 총 36개의 vertex값들을 정의하여 담아놓은 배열.
  // 왜 정육면체가 꼭지점이 36개냐? 면 6개 * 면 하나당 삼각형 2개 * 삼각형 하나당 꼭지점 3개 = 36개니까...

  // 처음부터 형식화 배열로 미리 만들어놓은 뒤 BufferAttribute에 할당하는 방법도 있음
  const numVertices = vertices.length; // 정점의 총 갯수
  const positionNumComponents = 3;
  const normalNumComponents = 3;
  const uvNumComponents = 2; // BufferAttribute를 생성할 때 하나의 꼭지점에 대해 각각의 배열에서 몇 개의 요소를 사용해야 하는건지 지정해준 값들.
  const positions = new Float32Array(numVertices * positionNumComponents);
  const normals = new Float32Array(numVertices * normalNumComponents);
  const uvs = new Float32Array(numVertices * uvNumComponents); // 형식화 배열은 처음 생성할 때 미리 크기를 지정해줘야 한다고 함. 총 몇개의 배열이 들어갈 것인지 미리 지정해줘야 한다는 뜻.
  let posIndex = 0;
  let normIndex = 0;
  let uvIndex = 0;
  for (const vertex of vertices) {
    // Float32Array.set(values, index)는 형식화 배열에 여러 개의 값을 저장할 때 사용함. index에 전달한 인덱스 지점부터 차례대로 여러 개의 값들을 저장하겠지?
    positions.set(vertex.pos, posIndex);
    normals.set(vertex.norm, normIndex);
    uvs.set(vertex.uv, uvIndex);
    // 반복문이 실행될 때마다 Float32Array.set()에 넣어줄 각각의 index값을 계산함.
    posIndex += positionNumComponents; // positions에는 매 반복문마다 3개의 값을 저장해주니까 posIndex를 3씩 더해줘서 그 다음 반복문에서 3개의 값들을 넣어주기 시작할 인덱스 지점 값을 미리 구해놓은 것.
    normIndex += normalNumComponents; // normals도 마찬가지고
    uvIndex += uvNumComponents; // uvs는 매 반복문마다 2개의 값을 저장할거니까 uvNumComponents를 더해주는 거고...
  }

  // BufferGeometry를 만들고, 각 배열들로 BufferAttribute 인스턴스를 생성한 뒤 그거를 앞에서 만든 BufferGeometry에 추가해 줌.
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    'position', // BufferAttribute를 생성할 때 Three.js가 원하는 속성 이름을 써줘야 함.
    new THREE.BufferAttribute(positions, positionNumComponents) // BufferAttribute에 할당할 때 형식화 배열로 변환하는 게 아니라, 미리 형식화 배열로 만들어 놓고 바로 할당해버림.
  );
  geometry.setAttribute(
    'normal',
    new THREE.BufferAttribute(normals, normalNumComponents)
  );
  geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(uvs, uvNumComponents)
  );

  // 중복되는 vertex data를 제거해서 사용하기
  geometry.setIndex([
    0, 1, 2, 2, 1, 3, // 앞쪽
    4, 5, 6, 6, 5, 7, // 오른쪽
    8, 9, 10, 10, 9, 11, // 뒤쪽
    12, 13, 14, 14, 13, 15, // 왼쪽
    16, 17, 18, 18, 17, 19, // 상단
    20, 21, 22, 22, 21, 23, // 하단
  ]);

  // load texture
  const loader = new THREE.TextureLoader();
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');

  // 위에서 만든 Buffer Geometry와 로드한 텍스처를 할당한 퐁-머티리얼로 큐브 메쉬를 만들어주는 함수
  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({
      color,
      map: texture
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); // 생성된 메쉬들은 미리미리 씬에 다 추가해놓기

    cube.position.x = x; // 전달받은 x값으로 x좌표값을 이동시켜서 큐브 사이에 간격을 띄워 줌.
    return cube; // 메쉬 객체를 리턴해줘서 메쉬 객체가 담긴 cubes 배열을 만들고 그걸로 animate 함수에서 for loop를 돌려 애니메이션을 계산해줄거임 
  }

  // 큐브 메쉬를 모아놓은 배열 생성
  const cubes = [
    makeInstance(geometry, 0x88FF88, 0),
    makeInstance(geometry, 0x8888FF, -4),
    makeInstance(geometry, 0xFF8888, 4)
  ];

  // resize
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // animate
  function animate(t) {
    t *= 0.001; // 초 단위로 변환

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, index) => {
      const speed = 1 + index * 0.1;
      const rotate = t * speed;
      cube.rotation.x = rotate;
      cube.rotation.y = rotate;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

main();