import threading


def parallel_run(func, args_list, max_workers=10, timeout=200):
    results = []
    
    length = len(args_list)
    args_list = [args_list[i:i+max_workers] for i in range(0, length, max_workers)]
    for args in args_list:
        threads = []
        for arg in args:
            thread = threading.Thread(target=func, args=arg)
            threads.append(thread)
            thread.start()
        for thread in threads:
            thread.join(timeout=timeout)
            if thread.is_alive():
                raise TimeoutError(f"Thread {thread.ident} timed out")
            results.append(thread.result)

    return results

