import base64
from .. import logger, UPLOAD_PREFIX


def sm_parse_raw_image(raw_data: dict) -> tuple[str, str]:
    logger.log_assert('image_name' in raw_data and 'image_content' in raw_data, 'raw_data object does not contain the required keys (aka image_name and image_content)!')
    name = raw_data['image_name'].split('\\')[-1]
    content = base64.b64decode(raw_data['image_content'].split('data:image/png;base64,')[-1])
    return name, content


def sm_save_file(path: str, content: str) -> None:
    logger.log_assert(path.startswith(UPLOAD_PREFIX), f'path must start with {UPLOAD_PREFIX} !')
    with open(path, 'wb') as f:
        f.write(content)